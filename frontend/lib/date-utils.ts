export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return dateString;
  }
};

export const convertToApiDate = (dateString: string): string => {
  return dateString;
};

export const getDayOfWeek = (dateString: string): string => {
  try {
    let date: Date;

    // Handle both formats: yyyy-MM-dd and dd/MM/yyyy
    if (dateString.includes("-")) {
      date = new Date(dateString);
    } else {
      const [day, month, year] = dateString.split("/");
      date = new Date(`${year}-${month}-${day}`);
    }

    if (isNaN(date.getTime())) return "";

    const days = [
      "LUNES",
      "MARTES",
      "MIERCOLES",
      "JUEVES",
      "VIERNES",
      "SABADO",
      "DOMINGO",
    ];
    const dayIndex = date.getDay();
    return days[(dayIndex + 6) % 7];
  } catch {
    return "";
  }
};

export const parseDateToDDMMYYYY = (input: string): string => {
  try {
    if (input.includes("/")) return input;

    const date = new Date(input);
    if (isNaN(date.getTime())) return input;

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return input;
  }
};
