export const round = (value, decimals) => `${Math.round(`${value}e${decimals}`)}e-${decimals}`
  |> Number;
