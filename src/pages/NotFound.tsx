import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="flex min-h-screen items-center justify-center bg-background px-4">
    <div className="max-w-md text-center">
      <h1 className="font-serif text-7xl font-black text-foreground">404</h1>
      <h2 className="mt-4 text-xl font-bold uppercase tracking-widest text-foreground">
        Page not found
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="mt-6">
        <Link
          to="/"
          className="inline-flex items-center justify-center bg-foreground px-6 py-3 text-xs font-black uppercase tracking-widest text-background transition-colors hover:bg-accent"
        >
          Go home
        </Link>
      </div>
    </div>
  </div>
);

export default NotFound;
