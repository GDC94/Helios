import { TrendingUp, AlertCircle } from "lucide-react";

const ChartEmptyState = () => {
  return (
    <div className="h-[250px] w-full flex flex-col items-center justify-center px-4">
      <div className="relative mb-4">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center border-2 border-gray-100">
          <TrendingUp className="w-8 h-8 text-gray-300" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
          <AlertCircle className="w-4 h-4 text-blue-600" />
        </div>
      </div>

      <div className="text-center max-w-md">
        <h3 className="text-[#152935] font-medium text-sm mb-2">
          No hay datos disponibles
        </h3>
        <p className="text-[#808080] text-xs leading-relaxed">
          No se encontraron datos para el rango seleccionado. Intenta
          seleccionar un rango diferente o verifica la conexión.
        </p>
      </div>

      <div className="mt-6 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-gray-200"></div>
        <div className="w-2 h-2 rounded-full bg-gray-150"></div>
        <div className="w-2 h-2 rounded-full bg-gray-100"></div>
      </div>
    </div>
  );
};

export default ChartEmptyState;
