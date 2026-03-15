const defaultInventory = [
  {
    project: "Paradise Valley Residence",
    itemId: "ITEM-1001",
    date: "2026-03-10",
    item: "Mirror Set",
    quantity: 4,
    location: "100-01A",
    status: "received",
    notes: "Ready for install",
    damage: "No Damage"
  },
  {
    project: "Scottsdale Model Home",
    itemId: "ITEM-1002",
    date: "2026-03-11",
    item: "Dining Pendants",
    quantity: 2,
    location: "104-03B",
    status: "hold",
    notes: "Waiting for PO",
    damage: "Minor Damage"
  },
  {
    project: "Arcadia Remodel",
    itemId: "ITEM-1003",
    date: "2026-03-12",
    item: "Bar Stools",
    quantity: 6,
    location: "200-02A",
    status: "received",
    notes: "Verify quantity",
    damage: "No Damage"
  },
  {
    project: "Biltmore Spec Project",
    itemId: "ITEM-1004",
    date: "2026-03-12",
    item: "Coffee Tables",
    quantity: 2,
    location: "300-02A",
    status: "delivered",
    notes: "Staged for delivery",
    damage: "No Damage"
  }
];

let inventory = JSON.parse(JSON.stringify(defaultInventory));

function getStatusBadge(status) {
  const labelMap = {
    received: "Received",
    hold: "Hold",
    delivered: "Delivered",
    inspection: "Inspection"
  };

  return `<span class="badge ${status}">${labelMap[status] || status}</span>`;
}

function renderInventory() {
  const table = document.getElementById("inventoryTable");
  if (!table) return;

  table.innerHTML = "";

  inventory.forEach((row, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>
        <input
          type="text"
          value="${escapeHtml(row.project)}"
          onchange="updateField(${index}, 'project', this.value)"
        />
      </td>

      <td>
        <input
          type="text"
          value="${escapeHtml(row.itemId)}"
          onchange="updateField(${index}, 'itemId', this.value)"
        />
      </td>

      <td>
        <input
          type="date"
          value="${escapeHtml(row.date)}"
          onchange="updateField(${index}, 'date', this.value)"
        />
      </td>

      <td>
        <input
          type="text"
          value="${escapeHtml(row.item)}"
          onchange="updateField(${index}, 'item', this.value)"
        />
      </td>

      <td>
        <input
          type="number"
          min="0"
          value="${Number(row.quantity) || 0}"
          onchange="updateField(${index}, 'quantity', this.value)"
        />
      </td>

      <td>
        <input
          type="text"
          value="${escapeHtml(row.location)}"
          onchange="updateField(${index}, 'location', this.value)"
        />
      </td>

      <td>
        <select onchange="updateField(${index}, 'status', this.value)">
          <option value="received" ${row.status === "received" ? "selected" : ""}>Received</option>
          <option value="hold" ${row.status === "hold" ? "selected" : ""}>Hold</option>
          <option value="delivered" ${row.status === "delivered" ? "selected" : ""}>Delivered</option>
          <option value="inspection" ${row.status === "inspection" ? "selected" : ""}>Inspection</option>
        </select>
        ${getStatusBadge(row.status)}
      </td>

      <td>
        <select onchange="updateField(${index}, 'notes', this.value)">
          <option value="Ready for install" ${row.notes === "Ready for install" ? "selected" : ""}>Ready for install</option>
          <option value="Waiting for PO" ${row.notes === "Waiting for PO" ? "selected" : ""}>Waiting for PO</option>
          <option value="Verify quantity" ${row.notes === "Verify quantity" ? "selected" : ""}>Verify quantity</option>
          <option value="Staged for delivery" ${row.notes === "Staged for delivery" ? "selected" : ""}>Staged for delivery</option>
        </select>
      </td>

      <td>
        <select onchange="updateField(${index}, 'damage', this.value)">
          <option value="No Damage" ${row.damage === "No Damage" ? "selected" : ""}>No Damage</option>
          <option value="Minor Damage" ${row.damage === "Minor Damage" ? "selected" : ""}>Minor Damage</option>
          <option value="Major Damage" ${row.damage === "Major Damage" ? "selected" : ""}>Major Damage</option>
          <option value="Return Required" ${row.damage === "Return Required" ? "selected" : ""}>Return Required</option>
        </select>
      </td>

      <td>
        <button class="delete-btn" onclick="deleteRow(${index})">Delete</button>
      </td>
    `;

    table.appendChild(tr);
  });

  renderCycleCount();
}

function renderCycleCount() {
  const list = document.getElementById("cycleCount");
  if (!list) return;

  list.innerHTML = "";

  inventory.slice(0, 3).forEach((row) => {
    const li = document.createElement("li");
    li.textContent = `${row.location || "No Location"} — Verify quantity and condition for ${row.project || "Unnamed Project"}`;
    list.appendChild(li);
  });
}

function updateField(index, field, value) {
  if (!inventory[index]) return;

  if (field === "quantity") {
    inventory[index][field] = Number(value) || 0;
  } else {
    inventory[index][field] = value;
  }

  renderInventory();
}

function addRow() {
  inventory.push({
    project: "",
    itemId: "",
    date: "",
    item: "",
    quantity: 1,
    location: "",
    status: "received",
    notes: "Ready for install",
    damage: "No Damage"
  });

  renderInventory();
}

function deleteRow(index) {
  inventory.splice(index, 1);
  renderInventory();
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

document.addEventListener("DOMContentLoaded", () => {
  const addRowBtn = document.getElementById("addRowBtn");
  if (addRowBtn) {
    addRowBtn.addEventListener("click", addRow);
  }

  renderInventory();
});
