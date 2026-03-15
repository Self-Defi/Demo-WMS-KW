const STORAGE_KEY = "kw_wms_inventory_v8";

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
  },
  {
    project: "Silverleaf Estate",
    itemId: "WH000005",
    date: "2026-03-13",
    item: "Console Table",
    quantity: 1,
    location: "100-02B",
    status: "received",
    notes: "Ready for install",
    damage: "No Damage"
  },
  {
    project: "Desert Mountain Residence",
    itemId: "WH000006",
    date: "2026-03-13",
    item: "Accent Chairs",
    quantity: 2,
    location: "101-01A",
    status: "inspection",
    notes: "Verify quantity",
    damage: "Minor Damage"
  },
  {
    project: "Camelback Remodel",
    itemId: "WH000007",
    date: "2026-03-14",
    item: "Area Rug",
    quantity: 1,
    location: "201-03B",
    status: "hold",
    notes: "Waiting for PO",
    damage: "No Damage"
  },
  {
    project: "North Scottsdale Project",
    itemId: "WH000008",
    date: "2026-03-14",
    item: "Nightstands",
    quantity: 2,
    location: "202-02A",
    status: "received",
    notes: "Ready for install",
    damage: "No Damage"
  },
  {
    project: "Paradise Ranch",
    itemId: "WH000009",
    date: "2026-03-14",
    item: "Outdoor Dining Set",
    quantity: 1,
    location: "301-01B",
    status: "delivered",
    notes: "Staged for delivery",
    damage: "No Damage"
  },
  {
    project: "Beverly Hills Install",
    itemId: "WH000010",
    date: "2026-03-15",
    item: "Pendant Lighting",
    quantity: 3,
    location: "302-02A",
    status: "received",
    notes: "Ready for install",
    damage: "No Damage"
  }
];

let inventory = loadInventory();
let searchType = "location";
let searchValue = "";

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

  const searchTypeEl = document.getElementById("searchType");
  const searchValueEl = document.getElementById("searchValue");

  searchType = "location";
  searchValue = "";

  if (searchTypeEl) searchTypeEl.value = "location";
  if (searchValueEl) {
    searchValueEl.value = "";
    searchValueEl.placeholder = "Search rack location (ex: 200-02A or 300-02A)";
  }

  hideItemCard();
  closeRackModal();
  renderInventory();
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

function getStatusLabel(status) {
  const labelMap = {
    received: "Received",
    hold: "Hold",
    delivered: "Delivered",
    inspection: "Inspection"
  };
  return labelMap[status] || status;
}

function getStatusBadge(status) {
  return `<span class="badge ${status}">${getStatusLabel(status)}</span>`;
}

function parseLocationParts(location) {
  const text = String(location || "").trim();
  const match = text.match(/^(\d{3})-(\d{2})([A-Za-z])$/);
  if (!match) {
    return {
      rack: "",
      shelf: "",
      side: "",
      full: text
    };
  }

  return {
    rack: match[1],
    shelf: match[2],
    side: match[3].toUpperCase(),
    full: text
  };
}

function getFilteredInventory() {
  if (!searchValue.trim()) return inventory;

  const value = searchValue.trim().toLowerCase();

  return inventory.filter((row) => {
    if (searchType === "itemId") {
      return String(row.itemId || "").toLowerCase().includes(value);
    }

    if (searchType === "rack") {
      const parts = parseLocationParts(row.location);
      return String(parts.rack || "").toLowerCase().includes(value);
    }

    return String(row.location || "").toLowerCase().includes(value);
  });
}

function showItemCard(row) {
  const section = document.getElementById("itemCardSection");
  if (!section || !row) return;

  document.getElementById("detailItemName").textContent = row.item || "Unnamed Item";
  document.getElementById("detailItemId").textContent = row.itemId || "";
  document.getElementById("detailProject").textContent = row.project || "";
  document.getElementById("detailQuantity").textContent = String(row.quantity ?? "");
  document.getElementById("detailLocation").textContent = row.location || "";
  document.getElementById("detailDate").textContent = formatDisplayDate(row.date);
  document.getElementById("detailNotes").textContent = row.notes || "";
  document.getElementById("detailDamage").textContent = row.damage || "";

  const badge = document.getElementById("detailStatusBadge");
  badge.className = `badge ${row.status || "received"}`;
  badge.textContent = getStatusLabel(row.status || "received");

  section.classList.remove("hidden");
}

function hideItemCard() {
  const section = document.getElementById("itemCardSection");
  if (section) {
    section.classList.add("hidden");
  }
}

function openItemCardByIndex(index) {
  if (!inventory[index]) return;
  showItemCard(inventory[index]);
  closeRackModal();
}

function buildRackItems(rackCode) {
  return inventory
    .filter((row) => parseLocationParts(row.location).rack === String(rackCode))
    .sort((a, b) => {
      const aParts = parseLocationParts(a.location);
      const bParts = parseLocationParts(b.location);

      if (aParts.shelf !== bParts.shelf) {
        return aParts.shelf.localeCompare(bParts.shelf);
      }
      return aParts.side.localeCompare(bParts.side);
    });
}

function openRackModal(rackCode) {
  const modal = document.getElementById("rackModal");
  const title = document.getElementById("rackModalTitle");
  const subtitle = document.getElementById("rackModalSubtitle");
  const summary = document.getElementById("rackSummary");
  const body = document.getElementById("rackItemsBody");

  if (!modal || !title || !subtitle || !summary || !body) return;

  const rackItems = buildRackItems(rackCode);

  title.textContent = `Rack ${rackCode}`;
  subtitle.textContent = "Items currently assigned to this rack";

  summary.innerHTML = "";
  body.innerHTML = "";

  const totalItems = rackItems.length;
  const totalQty = rackItems.reduce((sum, row) => sum + (Number(row.quantity) || 0), 0);

  [
    `Rack: ${rackCode}`,
    `Records: ${totalItems}`,
    `Total Qty: ${totalQty}`
  ].forEach((text) => {
    const chip = document.createElement("div");
    chip.className = "summary-chip";
    chip.textContent = text;
    summary.appendChild(chip);
  });

  if (rackItems.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="5">No items currently assigned to this rack.</td>`;
    body.appendChild(tr);
  } else {
    rackItems.forEach((row) => {
      const parts = parseLocationParts(row.location);
      const realIndex = inventory.findIndex((item) => item.itemId === row.itemId);

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>
          <button
            type="button"
            class="rack-item-button"
            onclick="openItemCardByIndex(${realIndex})"
          >
            ${escapeHtml(row.itemId)}
          </button>
        </td>
        <td>${escapeHtml(row.item)}</td>
        <td>${escapeHtml(parts.shelf)}</td>
        <td>${escapeHtml(parts.side)}</td>
        <td>${escapeHtml(parts.full)}</td>
      `;
      body.appendChild(tr);
    });
  }

  modal.classList.remove("hidden");
}

function closeRackModal() {
  const modal = document.getElementById("rackModal");
  if (modal) {
    modal.classList.add("hidden");
  }
}

function updateItemCardForSearch(filteredInventory) {
  if (searchType === "itemId" && searchValue.trim()) {
    if (filteredInventory.length > 0) {
      showItemCard(filteredInventory[0]);
    } else {
      hideItemCard();
    }
    return;
  }

  if (searchType === "rack" && searchValue.trim()) {
    hideItemCard();
    openRackModal(searchValue.trim());
    return;
  }

  const params = new URLSearchParams(window.location.search);
  if (params.get("itemId") && filteredInventory.length > 0) {
    showItemCard(filteredInventory[0]);
    return;
  }

  if (params.get("rack") && searchValue.trim()) {
    hideItemCard();
    openRackModal(searchValue.trim());
    return;
  }

  if (!searchValue.trim()) {
    hideItemCard();
    closeRackModal();
  }
}

function renderInventory() {
  const table = document.getElementById("inventoryTable");
  if (!table) return;

  table.innerHTML = "";

  const filteredInventory = getFilteredInventory();
  updateItemCardForSearch(filteredInventory);

  if (filteredInventory.length === 0) {
    const emptyRow = document.createElement("tr");
    emptyRow.className = "empty-message";
    emptyRow.innerHTML = `<td colspan="10">No items match that search.</td>`;
    table.appendChild(emptyRow);
    return;
  }

  filteredInventory.forEach((row) => {
    const realIndex = inventory.findIndex((item) => item.itemId === row.itemId);
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>
        <button
          type="button"
          class="project-button"
          onclick="openItemCardByIndex(${realIndex})"
        >
          ${escapeHtml(row.project)}
        </button>
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

function updateSearchPlaceholder() {
  const input = document.getElementById("searchValue");
  if (!input) return;

  if (searchType === "itemId") {
    input.placeholder = "Search Item ID (ex: WH000001 or WH000004)";
    return;
  }

  if (searchType === "rack") {
    input.placeholder = "Search rack code (ex: 100, 200, 300)";
    return;
  }

  input.placeholder = "Search rack location (ex: 200-02A or 300-02A)";
}

function applyLookupFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const itemId = params.get("itemId");
  const location = params.get("location");
  const rack = params.get("rack");

  const searchTypeEl = document.getElementById("searchType");
  const searchValueEl = document.getElementById("searchValue");

  if (itemId) {
    searchType = "itemId";
    searchValue = itemId;

    if (searchTypeEl) searchTypeEl.value = "itemId";
    updateSearchPlaceholder();
    if (searchValueEl) searchValueEl.value = itemId;
    return;
  }

  if (rack) {
    searchType = "rack";
    searchValue = rack;

    if (searchTypeEl) searchTypeEl.value = "rack";
    updateSearchPlaceholder();
    if (searchValueEl) searchValueEl.value = rack;
    return;
  }

  if (location) {
    searchType = "location";
    searchValue = location;

    if (searchTypeEl) searchTypeEl.value = "location";
    updateSearchPlaceholder();
    if (searchValueEl) searchValueEl.value = location;
  }
}

function formatDisplayDate(dateValue) {
  if (!dateValue) return "";
  const date = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateValue;

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const addRowBtn = document.getElementById("addRowBtn");
  const resetBtn = document.getElementById("resetBtn");
  const searchTypeEl = document.getElementById("searchType");
  const searchValueEl = document.getElementById("searchValue");
  const closeRackModalBtn = document.getElementById("closeRackModalBtn");
  const rackModalBackdrop = document.getElementById("rackModalBackdrop");

  if (addRowBtn) {
    addRowBtn.addEventListener("click", addRow);
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", resetInventory);
  }

  if (searchTypeEl) {
    searchTypeEl.addEventListener("change", (event) => {
      searchType = event.target.value || "location";
      updateSearchPlaceholder();
      renderInventory();
    });
  }

  if (searchValueEl) {
    searchValueEl.addEventListener("input", (event) => {
      searchValue = event.target.value || "";
      renderInventory();
    });
  }

  if (closeRackModalBtn) {
    closeRackModalBtn.addEventListener("click", closeRackModal);
  }

  if (rackModalBackdrop) {
    rackModalBackdrop.addEventListener("click", closeRackModal);
  }

  updateSearchPlaceholder();
  applyLookupFromUrl();
  renderInventory();
});

window.openItemCardByIndex = openItemCardByIndex;
window.closeRackModal = closeRackModal;
