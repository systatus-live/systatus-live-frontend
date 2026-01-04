import momentTz from "moment-timezone";
momentTz.locale("pt-br");

export default function formatDate(date: string, outputFormat: string, inputFormat: string | null = null) {
  if (inputFormat) {
    return momentTz(date, inputFormat).tz("America/Sao_Paulo").format(outputFormat);
  }
  return momentTz(new Date(date), false).tz("America/Sao_Paulo").format(outputFormat);
}