import { createContext } from "react";

const Context = createContext<any | undefined>({dashboardView:"expanded"});

export default function ViewProvider() {}
