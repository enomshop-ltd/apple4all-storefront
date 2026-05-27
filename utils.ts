import { createDefine } from "fresh";
import { HttpTypes } from "@medusajs/types";

// --- EXISTING CODE ---
// This specifies the type of "ctx.state" which is used to share
// data among middlewares, layouts and routes.
export interface State {
  shared: string;
  customer?: HttpTypes.StoreCustomer;
  order?: HttpTypes.StoreOrder;
  orders?: HttpTypes.StoreOrder[];
  cart?: HttpTypes.StoreCart;
}

export const define = createDefine<State>();
