import React, { useMemo } from "react";
import Total from "../Total/Total";
import { useState } from "react";

const currency = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
});

const ADMIN_RATE = 0.1; //10%

export default function AddTips() {
  const [cash, setCash] = useState("");
  const [machineD, setMachineD] = useState("");
  const [machineT, setMachineT] = useState("");
  const [online, setOnline] = useState("");

  const toNum = (v) => (v === "" ? 0 : Number(v));

  const { total, admin, pooling } = useMemo(() => {
    const c = toNum(cash);
    const d = toNum(machineD);
    const t = toNum(machineT);
    const o = toNum(online);

    const sum = (c || 0) + (d || 0) + (t || 0) + (o || 0);

    const adminFee = Math.round(sum * ADMIN_RATE * 100) / 100;
    const afterDeduction = Math.round((sum - adminFee) * 100) / 100;

    return { total: sum, admin: adminFee, pooling: afterDeduction };
  }, [cash, machineD, machineT, online]);

  return (
    <div>
      <form>
        <div>
          <label for="cash">(1)Cash Tips</label>
          <input
            type="number"
            id="cash"
            name="cash"
            inputMode="decimal"
            step="0.01"
            min="0"
            value={cash}
            onChange={(e) => setCash(e.target.value)}
            placeholder="0.00"
          />
        </div>
        <div>
          <label for="machineD">(2)Machine(Dine in) Tips</label>
          <input
            type="number"
            id="machineD"
            name="machineD"
            inputMode="decimal"
            step="0.01"
            min="0"
            value={machineD}
            onChange={(e) => setMachineD(e.target.value)}
            placeholder="0.00"
          />
        </div>
        <div>
          <label for="machineT">(3)Machine(To go) Tips</label>
          <input
            type="number"
            id="machineT"
            name="machineT"
            inputMode="decimal"
            step="0.01"
            min="0"
            value={machineT}
            onChange={(e) => setMachineT(e.target.value)}
            placeholder="0.00"
          />
        </div>
        <div>
          <label for="online">(4)Online Order(Pick up) Tips</label>
          <input
            type="number"
            id="online"
            name="online"
            inputMode="decimal"
            step="0.01"
            min="0"
            value={online}
            onChange={(e) => setOnline(e.target.value)}
            placeholder="0.00"
          />
        </div>
      </form>

      <div>
        <span>Total Tip</span>
        <strong>{currency.format(total)}</strong>
      </div>
      <div>
        <span>Admin(10%)</span>
        <strong>{currency.format(admin)}</strong>
      </div>
      <div>
        <span>Tip Pool(90%)</span>
        <strong>{currency.format(pooling)}</strong>
      </div>
    </div>
  );
}
