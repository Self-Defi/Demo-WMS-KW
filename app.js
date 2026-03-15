let inventory = [
  {
    project: "Paradise Valley Residence",
    itemId: "ITEM-1001",
    date: "2026-03-10",
    item: "Mirror set",
    quantity: 4,
    location: "100-01A",
    status: "received",
    notes: "Waiting room assignment",
    damage: "None"
  },
  {
    project: "Scottsdale Model Home",
    itemId: "ITEM-1002",
    date: "2026-03-11",
    item: "Dining pendants",
    quantity: 2,
    location: "104-03B",
    status: "hold",
    notes: "No PO at intake",
    damage: "Carton corner crushed"
  },
  {
    project: "Arcadia Remodel",
    itemId: "ITEM-1003",
    date: "2026-03-12",
    item: "Bar stools",
    quantity: 6,
    location: "200-02A",
    status: "received",
    notes: "Verified count",
    damage: "None"
  },
  {
    project: "Biltmore Spec Project",
    itemId: "ITEM-1004",
    date: "2026-03-12",
    item: "Coffee tables",
    quantity: 2,
    location: "300-02A",
    status: "delivered",
    notes: "Moved to staging",
    damage: "None"
  }
];

function getStatusBadge(status) {
  return `<span class="badge ${status}">${status}</span>`;
}

function renderInventory() {
  const table = document.getElementById("inventoryTable");
  table.innerHTML = "";

  inventory.forEach((row, index) => {
    table.innerHTML += `
      <tr>

        <td>
          <input value="${row.project}"
          onchange="updateField(${index}, 'project', this.value)">
        </td>

        <td>
          <input value="${row.itemId}"
          onchange="updateField(${index}, 'itemId', this.value)">
        </td>

        <td>
          <input type="date" value="${row.date}"
          onchange="updateField(${index}, 'date', this.value)">
        </td>

        <td>
          <input value="${row.item}"
          onchange="updateField(${index}, 'item', this.value)">
        </td>

        <td>
          <input type="number" min="0" value="${row.quantity}"
          onchange="updateField(${index}, 'quantity', this.value)">
        </td>

        <td>
          <input value="${row.location}"
          onchange="updateField(${index}, 'location', this.value)">
        </td>

        <td>
          <select onchange="updateField(${index}, 'status', this.value)">
            <option value="received" ${row.status==="received"?"selected":""}>Received</option>
            <option value="hold" ${row.status==="hold"?"selected":""}>Hold</option>
            <option value="delivered" ${row.status==="delivered"?"selected":""}>Delivered</option>
            <option value="inspection" ${row.status==="inspection"?"selected":""}>Inspection</option>
          </select>
        </td>

        <td>
          <select onchange="updateField(${index}, 'notes', this.value)">
            <option value="">Select</option>
            <option value="Ready for install" ${row.notes==="Ready for install"?"selected":""}>Ready for install</option>
            <option value="Waiting for PO" ${row.notes==="Waiting for PO"?"selected":""}>Waiting for PO</option>
            <option value="Verify quantity" ${row.notes==="Verify quantity"?"selected":""}>Verify quantity</option>
            <option value="Staged for delivery" ${row.notes==="Staged for delivery"?"selected":""}>Staged for delivery</option>
          </select>
        </td>

        <td>
          <select onchange="updateField(${index}, 'damage', this.value)">
            <option value="">Select</option>
            <option value="No Damage" ${row.damage==="No Damage"?"selected":""}>No Damage</option>
            <option value="Minor Damage" ${row.damage==="Minor Damage"?"selected":""}>Minor Damage</option>
            <option value="Major Damage" ${row.damage==="Major Damage"?"selected":""}>Major Damage</option>
            <option value="Return Required" ${row.damage==="Return Required"?"selected":""}>Return Required</option>
          </select>
        </td>

        <td>
          <button onclick="deleteRow(${index})" class="delete-btn">Delete</button>
        </td>

      </tr>
    `;
  });

  renderCycleCount();
}

function deleteRow(index) {
  inventory.splice(index, 1);
  renderInventory();
}

function renderCycleCount() {
  const list = document.getElementById("cycleCount");
  list.innerHTML = "";

  inventory.slice(0, 3).forEach(row => {
    list.innerHTML += `
      <li>
        ${row.location || "No Location"} — Verify quantity and condition for ${row.project || "Unnamed Project"}
      </li>
    `;
  });
}

document.getElementById("addRowBtn").addEventListener("click", addRow);

renderInventory();
