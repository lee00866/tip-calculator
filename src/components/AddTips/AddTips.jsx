import React, { useMemo } from "react";
import { useState } from "react";

const currency = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
});

const ADMIN_RATE = 0.1; //10%
const KITCHEN_PERCENTAGE = 0.4; //40%

const trunc2 = (n) => Math.trunc(n * 100) / 100; //소수 셋째자리에서 버림

export default function AddTips() {
  const [cash, setCash] = useState("");
  const [machineD, setMachineD] = useState("");
  const [machineT, setMachineT] = useState("");
  const [online, setOnline] = useState("");
  const [kitchen, setKitchen] = useState("");
  const [server, setServer] = useState("");

  const toNum = (v) => {
    if (v === "" || v == null) return 0;

    const n = typeof v === "number" ? v : parseFloat(v);
    return Number.isFinite(n) ? n : 0;
  };

  const handleReset = () => {
    setCash("");
    setMachineD("");
    setMachineT("");
    setOnline("");
    setKitchen("");
    setServer("");
  };

  const {
    total,
    admin,
    pooling,
    kitchenPool,
    serverPool,
    perKitchenEach,
    perServerEach,
  } = useMemo(() => {
    const c = toNum(cash);
    const d = toNum(machineD);
    const t = toNum(machineT);
    const o = toNum(online);
    const k = Math.max(0, Math.trunc(toNum(kitchen)));
    const s = Math.max(0, Math.trunc(toNum(server)));

    const sum = c + d + t + o;

    //Admin 10% deduct
    const adminFee = Math.round(sum * ADMIN_RATE * 100) / 100;
    //Total tip pool
    const afterDeduction = Math.round((sum - adminFee) * 100) / 100;

    //Kitchen tip pool
    const goingKitchen = trunc2(afterDeduction * KITCHEN_PERCENTAGE);
    //Server tip pool
    const goingServer = afterDeduction - goingKitchen;

    const perK = kitchen > 0 ? trunc2(goingKitchen / k) : 0;
    const perS = server > 0 ? trunc2(goingServer / s) : 0;

    return {
      total: sum,
      admin: adminFee,
      pooling: afterDeduction,
      kitchenPool: goingKitchen,
      serverPool: goingServer,
      perKitchenEach: perK,
      perServerEach: perS,
    };
  }, [cash, machineD, machineT, online, kitchen, server]);

  return (
    <>
      <div className="toolbar">
        <h1>Tip Calculator💸</h1>
        <button className="btn" type="button" onClick={handleReset}>
          Reset
        </button>
      </div>
      <div className="card">
        <div className="row">
          <div className="cell cell--index">(1)</div>
          <label className="cell cell--label" htmlFor="cash">
            Cash Tips
          </label>
          <div className="cell">-</div>
          <div className="cell">
            <input
              className="cell cell-input"
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
        </div>
        <div className="row">
          <div className="cell cell--index">(2)</div>
          <label className="cell cell--label" htmlFor="machineD">
            Machine(Dine in) Tips
          </label>
          <div className="cell">-</div>
          <div className="cell">
            <input
              className="cell cell-input"
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
        </div>
        <div className="row">
          <div className="cell cell--index">(3)</div>
          <label className="cell cell--label" htmlFor="machineT">
            Machine(To go) Tips
          </label>
          <div className="cell">-</div>
          <div className="cell">
            <input
              className="cell cell-input"
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
        </div>
        <div className="row">
          <div className="cell cell--index">(4)</div>
          <label className="cell cell--label" htmlFor="online">
            Online Order(Pick up) Tips
          </label>
          <div className="cell">-</div>
          <div className="cell">
            <input
              className="cell-input"
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
        </div>

        <div className="row">
          <div className="cell cell--index">(5)</div>
          <div className="cell cell--label">Total Tip</div>
          <div className="cell">(1)+(2)+(3)+(4)</div>
          <strong className="cell cell--num">{currency.format(total)}</strong>
        </div>
        <div className="row">
          <div className="cell cell--index">(6)</div>
          <div className="cell cell--label">Admin(10%)</div>
          <div className="cell">-</div>
          <strong className="cell cell--num">{currency.format(admin)}</strong>
        </div>
        <div className="row">
          <div className="cell cell--index">(7)</div>
          <div className="cell cell--label">Tip Pool(90%)</div>
          <div className="cell">(5) * 0.9</div>
          <strong className="cell cell--num">{currency.format(pooling)}</strong>
        </div>
        <div className="row">
          <div className="cell cell--index">(8)</div>
          <div className="cell cell--label">
            Kitchen Tips(40%)
            <input
              className="staffCnt"
              type="number"
              id="kitchen"
              name="kitchen"
              inputMode="decimal"
              min="0"
              value={kitchen}
              placeholder="0"
              onChange={(e) => setKitchen(e.target.value)}
            />
          </div>
          <div className="cell">(7) * 0.4</div>
          <strong className="cell cell--num">
            {currency.format(kitchenPool)}
          </strong>
        </div>

        {Array.from({ length: kitchen }).map((_, i) => {
          return (
            <div className="row">
              <div className="cell cell--index">-</div>
              <div className="cell cell--label">Kitchen {i + 1}</div>
              <strong className="cell cell--num">
                {currency.format(perKitchenEach)}
              </strong>
              <div className="cell">-</div>
            </div>
          );
        })}

        <div className="row">
          <div className="cell cell--index">(9)</div>
          <div className="cell cell--label">
            Server Tips(60%)
            <input
              className="staffCnt"
              type="number"
              id="server"
              name="server"
              inputMode="decimal"
              min="0"
              value={server}
              placeholder="0"
              onChange={(e) => setServer(e.target.value)}
            />
          </div>
          <div className="cell">(7) * 0.6</div>
          <strong className="cell cell--num">
            {currency.format(serverPool)}
          </strong>
        </div>

        {Array.from({ length: server }).map((_, i) => {
          return (
            <div className="row">
              <div className="cell cell--index">-</div>
              <div className="cell cell--label">Server {i + 1}</div>
              <strong className="cell cell--num">
                {currency.format(perServerEach)}
              </strong>
              <div className="cell">-</div>
            </div>
          );
        })}
      </div>

      <div className="box">
        <strong>How to use</strong>
        <br />
        ① Fill in the inputs for (1), (2), (3), and (4).
        <br />② Input today's number of staff in (8) and (9).
      </div>
      <div className="box">
        <strong>How the calculation works</strong>
        <br />
        Each individual tip is truncated to two decimal places.
        <br />
        Example: $45.678 → $45.67
      </div>
    </>
  );
}
