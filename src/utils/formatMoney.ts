export default function formatMoney(value: number, decimals = 2) {
  return Number(value).toLocaleString('pt-BR', {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}