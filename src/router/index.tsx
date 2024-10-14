import App from "@/App";
import { createHashRouter } from "react-router-dom";

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [],
  },
]);

export default router;
