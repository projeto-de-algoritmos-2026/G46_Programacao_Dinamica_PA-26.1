export interface BatteryModule {
  id: string;
  name: string;
  cost: number;  // Representa o "Peso" na mochila (ex: $ mil)
  power: number; // Representa o "Valor" na mochila (ex: Megawatts)
}