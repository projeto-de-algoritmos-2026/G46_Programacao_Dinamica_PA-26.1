export interface BatteryModule {
  id: string;
  name: string;
  cost: number;  // Representa o "Peso" na mochila (ex: $ mil)
  power: number; // Representa o "Valor" na mochila (ex: Megawatts)
}

export interface TransmissionWindow {
  id: string;
  client: string;
  start: number;  // Hora de início (ex: 8 para 08:00)
  end: number;    // Hora de término (ex: 12 para 12:00)
  value: number;  // Valor do contrato (Peso/Retorno financeiro)
}