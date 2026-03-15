const STORAGE_KEY = "kw_wms_inventory_v3";

const defaultInventory = [
  {
    project: "Paradise Valley Residence",
    itemId: "WH000001",
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
    itemId: "WH000002",
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
    itemId: "WH000003",
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
    itemId: "WH000004",
    date: "2026-03-12",
    item: "Coffee Tables",
    quantity: 2,
    location: "300-02A",
    status: "delivered",
    notes: "Staged for delivery",
    damage: "No Damage"
  }
];

let inventory = loadInventory();
let locationFilter = "";

function cloneDefaultInventory() {
  return JSON.parse(JSON.stringify(defaultInventory));
}

function loadInventory() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return cloneDefaultInventory();

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return cloneDefaultInventory();

    return parsed;
  } catch (error) {
    return cloneDefaultInventory();
  }
}

function saveInventory() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
}

function resetInventory() {
  inventory = cloneDefaultInventory();
  saveInventory();
  renderInventory();

  const searchInput = document.getElementById("locationSearch");
  if (searchInput) {
    searchInput.value = "";
  }
  locationFilter = "";
}

function padWarehouseId(number) {
  return String(number).padStart(6, "0");
}

function getHighestWarehouseNumber() {
  let highest = 0;

  inventory.forEach((row) => {
    const match = String(row.itemId || "").match(/^WH(\d{6})$/i);
    if (match) {
      const num = Number(match[1]);
      if (num > highest) highest = num;
    }
  });

  return highest;
}

function generateItemId() {
  const nextNumber = getHighestWarehouseNumber() + 1;
  return `WH${padWarehouseId(nextNumber)}`;
}

function getStatusBadge(status) {
  const labelMap = {
    received: "Received",
    hold: "Hold",
    delivered: "Delivered",
    inspection: "Inspection"
  };

  return `<span class="badge ${status}">${labelMap[status] || status}</span>`;
}

function getFilteredInventory() {
  if (!locationFilter.trim()) return inventory;

  const search = locationFilter.trim().toLowerCase();
  return inventory.filter((row) =>
    String(row.location || "").toLowerCase().includes(search)
  );
}

function renderInventory() {
  const table = document.getElementById("inventoryTable");
  if (!table) return;

  table.innerHTML = "";

  const filteredInventory = getFilteredInventory();

  if (filteredInventory.length === 0) {
    const emptyRow = document.createElement("tr");
    emptyRow.className = "empty-message";
    emptyRow.innerHTML = `<td colspan="10">No items match that rack/location search.</td>`;
    table.appendChild(emptyRow);
    renderCycleCount();
    return;
  }

  filteredInventory.forEach((row) => {
    const realIndex = inventory.findIndex((item) => item.itemId === row.itemId);
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>
        <input
          type="text"
          value="${escapeHtml(row.project)}"
          onchange="updateField(${realIndex}, 'project', this.value)"
        />
      </td>

      <td>
        <input
          type="text"
          value="${escapeHtml(row.itemId)}"
          onchange="updateField(${realIndex}, 'itemId', this.value)"
        />
      </td>

      <td>
        <input
          type="date"
          value="${escapeHtml(row.date)}"
          onchange="updateField(${realIndex}, 'date', this.value)"
        />
      </td>

      <td>
        <input
          type="text"
          value="${escapeHtml(row.item)}"
          onchange="updateField(${realIndex}, 'item', this.value)"
        />
      </td>

      <td>
        <input
          type="number"
          min="0"
          value="${Number(row.quantity) || 0}"
          onchange="updateField(${realIndex}, 'quantity', this.value)"
        />
      </td>

      <td>
        <input
          type="text"
          value="${escapeHtml(row.location)}"
          onchange="updateField(${realIndex}, 'location', this.value)"
        />
      </td>

      <td>
        <select onchange="updateField(${realIndex}, 'status', this.value)">
          <option value="received" ${row.status === "received" ? "selected" : ""}>Received</option>
          <option value="hold" ${row.status === "hold" ? "selected" : ""}>Hold</option>
          <option value="delivered" ${row.status === "delivered" ? "selected" : ""}>Delivered</option>
          <option value="inspection" ${row.status === "inspection" ? "selected" : ""}>Inspection</option>
        </select>
        ${getStatusBadge(row.status)}
      </td>

      <td>
        <select onchange="updateField(${realIndex}, 'notes', this.value)">
          <option value="Ready for install" ${row.notes === "Ready for install" ? "selected" : ""}>Ready for install</option>
          <option value="Waiting for PO" ${row.notes === "Waiting for PO" ? "selected" : ""}>Waiting for PO</option>
          <option value="Verify quantity" ${row.notes === "Verify quantity" ? "selected" : ""}>Verify quantity</option>
          <option value="Staged for delivery" ${row.notes === "Staged for delivery" ? "selected" : ""}>Staged for delivery</option>
        </select>
      </td>

      <td>
        <select onchange="updateField(${realIndex}, 'damage', this.value)">
          <option value="No Damage" ${row.damage === "No Damage" ? "selected" : ""}>No Damage</option>
          <option value="Minor Damage" ${row.damage === "Minor Damage" ? "selected" : ""}>Minor Damage</option>
          <option value="Major Damage" ${row.damage === "Major Damage" ? "selected" : ""}>Major Damage</option>
          <option value="Return Required" ${row.damage === "Return Required" ? "selected" : ""}>Return Required</option>
        </select>
      </td>

      <td>
        <button class="delete-btn" onclick="deleteRow(${realIndex})">Delete</button>
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

  saveInventory();
  renderInventory();
}

function addRow() {
  inventory.push({
    project: "",
    itemId: generateItemId(),
    date: "",
    item: "",
    quantity: 1,
    location: "",
    status: "received",
    notes: "Ready for install",
    damage: "No Damage"
  });

  saveInventory();
  renderInventory();
}

function deleteRow(index) {
  inventory.splice(index, 1);
  saveInventory();
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
  const resetBtn = document.getElementById("resetBtn");
  const locationSearch = document.getElementById("locationSearch");

  if (addRowBtn) {
    addRowBtn.addEventListener("click", addRow);
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", resetInventory);
  }

  if (locationSearch) {
    locationSearch.addEventListener("input", (event) => {
      locationFilter = event.target.value || "";
      renderInventory();
    });
  }

  renderInventory();
});
