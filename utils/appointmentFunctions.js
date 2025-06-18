exports.mapFilesToAppointment = async (appointmentRows) => {
  const appointmentMap = new Map();
  for (const row of appointmentRows) {
    if (!appointmentMap.has(row.appointment_id)) {
      appointmentMap.set(row.appointment_id, {
        id: row.appointment_id,
        appointment_date: row.appointment_date,
        user_id: row.user_id,
        title: row.title,
        description: row.description,
        is_approved: row.is_approved,
        admin_review: row.admin_review,
        files: [],
      });
    }

    if (row.file_path) {
      appointmentMap.get(row.appointment_id).files.push(row.file_path);
    }
  }

  return Array.from(appointmentMap.values());
};
