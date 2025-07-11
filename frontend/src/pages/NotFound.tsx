import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { APP_ROUTES } from "@/config/routes";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-8">
      <div className="max-w-md text-center">
        <div className="mb-6">
          <h1 className="text-6xl font-bold text-sentoraBlueChart mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-sentoraBlackTitle mb-4">
            Página no encontrada
          </h2>
          <p className="text-muted-foreground">
            La página que estás buscando aún no existe.
          </p>
        </div>

        <div className="space-y-4">
          <Link to={APP_ROUTES.HOME} className="block">
            <Button className="w-full">Volver al Inicio</Button>
          </Link>

          <Link to={APP_ROUTES.DASHBOARD} className="block">
            <Button variant="outline" className="w-full">
              Volver al Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
