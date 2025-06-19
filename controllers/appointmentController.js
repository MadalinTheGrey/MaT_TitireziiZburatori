const appointmentModel = require("../models/appointmentModel");
const { z } = require("zod");
const fs = require("fs");
const path = require("path");
const Busboy = require("busboy");
const appointmentFunctions = require("../utils/appointmentFunctions");

function isTimestamp(value) {
  const iso8601 = value.replace(" ", "T");
  const date = new Date(iso8601);

  return !isNaN(date.getTime()) && iso8601.length >= 19;
}

const appointmentSchema = z.object({
  title: z.string().min(1),
  appointment_date: z.string().refine(isTimestamp, {
    message: "Invalid appointment date",
  }),
  description: z.string().min(1),
});

exports.addAppointment = async (req, res) => {
  const schemaResult = appointmentSchema.safeParse(req.body);
  if (!schemaResult.success) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        error: "Missing or malformed data for appointment",
        details: schemaResult.error.errors,
      })
    );
    return;
  }

  const appointment = {
    ...schemaResult.data,
    user_id: req.user.id,
  };

  try {
    const overlap = await appointmentModel.checkAppointmentOverlap(
      appointment.appointment_date
    );
    if (overlap) {
      res.writeHead(409, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          error: "Appointment time overlaps with other existing ones",
        })
      );
      return;
    }

    const appointmentId = await appointmentModel.addAppointment(appointment);
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ id: appointmentId }));
  } catch (error) {
    console.error("Error adding appointment: ", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal server error" }));
  }
};

exports.uploadAppointmentFiles = async (req, res) => {
  const appointmentId = parseInt(req.params.id);

  if (isNaN(appointmentId)) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Invalid appointment id" }));
    return;
  }

  try {
    const isAppointmentValid =
      await appointmentModel.checkAppointmentIdValidity(
        appointmentId,
        req.user.id
      );
    if (!isAppointmentValid) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          error: "Appointment does not exist or you are not the owner",
        })
      );
      return;
    }
  } catch (error) {
    console.error("Error checking appointment validity: ", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal server error" }));
  }

  const busboy = Busboy({ headers: req.headers });
  const uploadedFiles = [];
  const filePromises = [];

  busboy.on("file", (fieldname, file, fileInfo) => {
    const { filename } = fileInfo;
    if (!filename) return;

    const dir = path.join(
      __dirname,
      "..",
      "uploads",
      "appointments",
      appointmentId
    );

    const filePromise = async () => {
      await fs.promises.mkdir(dir, { recursive: true });

      const savePath = path.join(dir, Date.now() + "-" + filename);
      const writeStream = fs.createWriteStream(savePath);

      file.pipe(writeStream);

      await new Promise((resolve, reject) => {
        writeStream.on("finish", resolve);
        writeStream.on("error", reject);
      });

      const relativePath = path.relative(path.join(__dirname, ".."), savePath);
      await appointmentModel.addAppointmentFile(appointmentId, relativePath);
      uploadedFiles.push(relativePath);
    };

    filePromises.push(filePromise());
  });

  busboy.on("finish", async () => {
    try {
      await Promise.all(filePromises);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Files uploaded successfully",
          files: uploadedFiles,
        })
      );
    } catch (error) {
      console.error("Error saving files: ", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal server error" }));
    }
  });

  req.pipe(busboy);
};

exports.getAppointmentById = async (req, res) => {
  const appointmentId = parseInt(req.params.id);

  if (isNaN(appointmentId)) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Invalid appointment id" }));
    return;
  }

  try {
    const isAdmin = req.user.roles.includes("admin");
    const appointment = await appointmentModel.getAppointmentById(
      appointmentId,
      req.user.id,
      isAdmin
    );

    if (!appointment) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          error: "Appointment not found or you are not the owner",
        })
      );
      return;
    }

    const files = await appointmentModel.getAppointmentFiles(appointmentId);
    const filePaths = files.map((f) => f.file_path);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ appointment, filePaths }));
  } catch (error) {
    console.error("Error trying to fetch appointment by id: ", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal server error" }));
  }
};

exports.getAppointments = async (req, res) => {
  try {
    let appointments;
    let dbResults;
    if (req.user.roles.includes("admin")) {
      dbResults = await appointmentModel.getAppointmentsFiltered(req.query);
    } else {
      dbResults = await appointmentModel.getAppointmentsByUserId(req.user.id);
    }

    appointments = await appointmentFunctions.mapFilesToAppointment(dbResults);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ appointments }));
  } catch (error) {
    console.error("Error trying to fetch appointments: ", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal server error" }));
  }
};

const reviewSchema = z.object({
  is_approved: z
    .string()
    .transform((val) => val.toUpperCase())
    .refine((val) => ["PENDING", "APPROVED", "REJECTED"].includes(val), {
      message: "is_approved must be pending, approved, or rejected",
    }),
  admin_review: z.string().min(1),
});

exports.reviewAppointment = async (req, res) => {
  const appointmentId = parseInt(req.params.id);

  if (isNaN(appointmentId)) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Invalid appointment id" }));
    return;
  }

  const schemaResult = reviewSchema.safeParse(req.body);
  if (!schemaResult.success) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        error: "Missing or malformed review data",
        details: schemaResult.error.errors,
      })
    );
    return;
  }

  const review = schemaResult.data;

  try {
    const updated = await appointmentModel.updateAppointmentWithReview(
      review,
      appointmentId
    );
    if (updated) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Review added successfully" }));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Appointment not found" }));
    }
  } catch (error) {
    console.error("Error adding review: ", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal server error" }));
  }
};
