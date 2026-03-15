const inventory = [

{
project:"Paradise Valley Residence",
job:"KV-2418",
date:"2026-03-10",
item:"Mirror set / 4 cartons",
location:"100-01A",
status:"received",
notes:"Waiting room assignment",
damage:"None"
},

{
project:"Scottsdale Model Home",
job:"KV-2422",
date:"2026-03-11",
item:"Dining pendants / 2 boxes",
location:"104-03B",
status:"hold",
notes:"No PO at intake",
damage:"Carton corner crushed"
},

{
project:"Arcadia Remodel",
job:"KV-2399",
date:"2026-03-12",
item:"Bar stools / 6 units",
location:"200-02A",
status:"received",
notes:"Verified count",
damage:"None"
},

{
project:"Biltmore Spec Project",
job:"KV-2430",
date:"2026-03-12",
item:"Coffee tables / 2 crates",
location:"300-02A",
status:"delivered",
notes:"Moved to staging",
damage:"None"
}

];


function renderInventory(){

const table=document.getElementById("inventoryTable");

table.innerHTML="";

inventory.forEach(item=>{

table.innerHTML+=`

<tr>

<td>${item.project}</td>

<td>${item.job}</td>

<td>${item.date}</td>

<td>${item.item}</td>

<td><span class="location">${item.location}</span></td>

<td><span class="badge ${item.status}">${item.status}</span></td>

<td>${item.notes}</td>

<td>${item.damage}</td>

</tr>

`;

});

}

function renderCycleCount(){

const list=document.getElementById("cycleCount");

inventory.slice(0,3).forEach(item=>{

list.innerHTML+=`
<li>
${item.location} — Verify quantity and condition for ${item.project}
</li>
`;

});

}

renderInventory();

renderCycleCount();
