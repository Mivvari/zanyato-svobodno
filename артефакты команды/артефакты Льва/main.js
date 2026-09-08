
const coworkings = [
  { id: 1, name: "Атриум А1", people: 0, capacity: 20, floor: "1 этаж", occupancy: "low" },
  { id: 2, name: "Библиотечный зал", people: 18, capacity: 25, floor: "2 этаж", occupancy: "high" },
  { id: 3, name: "Инновационный хаб", people: 11, capacity: 20, floor: "3 этаж", occupancy: "medium" },
  { id: 4, name: "Коворкинг Б2", people: 2, capacity: 15, floor: "1 этаж", occupancy: "low" },
  { id: 5, name: "Коворкинг В3", people: 14, capacity: 18, floor: "2 этаж", occupancy: "high" },
  { id: 6, name: "Лаборатория идей", people: 8, capacity: 16, floor: "3 этаж", occupancy: "medium" },
  { id: 7, name: "Медиазона", people: 3, capacity: 12, floor: "1 этаж", occupancy: "low" },
  { id: 8, name: "Переговорная 101", people: 9, capacity: 10, floor: "1 этаж", occupancy: "high" },
  { id: 9, name: "Пространство Г4", people: 6, capacity: 20, floor: "2 этаж", occupancy: "low" },
  { id: 10, name: "Рабочий зал Д5", people: 12, capacity: 18, floor: "3 этаж", occupancy: "medium" },
  { id: 11, name: "Студенческий клуб", people: 16, capacity: 20, floor: "2 этаж", occupancy: "high" },
  { id: 12, name: "Тихая зона", people: 5, capacity: 18, floor: "2 этаж", occupancy: "low" },
  { id: 13, name: "Учебный центр", people: 10, capacity: 16, floor: "3 этаж", occupancy: "medium" },
  { id: 14, name: "Фокус-рум Е6", people: 7, capacity: 8, floor: "1 этаж", occupancy: "high" },
  { id: 15, name: "Хаб коллабораций", people: 9, capacity: 22, floor: "1 этаж", occupancy: "low" },
  { id: 16, name: "Цифровая студия", people: 13, capacity: 20, floor: "3 этаж", occupancy: "medium" },
  { id: 17, name: "Читальный зал", people: 2, capacity: 30, floor: "2 этаж", occupancy: "low" },
  { id: 18, name: "Штаб проектов", people: 17, capacity: 20, floor: "3 этаж", occupancy: "high" },
  { id: 19, name: "Экспресс-зона", people: 8, capacity: 12, floor: "1 этаж", occupancy: "medium" },
  { id: 20, name: "Открытый зал", people: 6, capacity: 25, floor: "2 этаж", occupancy: "low" }
];

const labels = {
  low: "Свободно",
  medium: "Средняя",
  high: "Занято"
};

let currentFilter = "all";
let currentSort = "default";

const grid = document.getElementById("grid");
const count = document.getElementById("count");
const sortSelect = document.getElementById("sort");

count.textContent =
  coworkings.length + " пространств в кампусе";

function smoothScrollTo(targetY, duration = 850) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo(0, targetY);
    return;
  }

  const startY = window.scrollY;
  const distance = targetY - startY;
  const startTime = performance.now();

  function animate(currentTime) {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    window.scrollTo(0, startY + distance * eased);
    if (progress < 1) requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

function scrollToTop() {
  smoothScrollTo(0);
}

function scrollToCoworkings() {
  const section = document.getElementById("coworkings");
  const headerOffset = 80;
  const targetY = section.getBoundingClientRect().top + window.scrollY - headerOffset;
  smoothScrollTo(targetY);
}

function render() {

  let list = [...coworkings];

  if (currentFilter !== "all") {
    list = list.filter(
      item => item.occupancy === currentFilter
    );
  }

  if (currentSort === "az") {
    list.sort(
      (a, b) =>
        a.name.localeCompare(b.name, "ru")
    );
  }

  if (currentSort === "za") {
    list.sort(
      (a, b) =>
        b.name.localeCompare(a.name, "ru")
    );
  }

  if (currentSort === "asc") {
    list.sort(
      (a, b) =>
        a.people / a.capacity -
        b.people / b.capacity
    );
  }

  if (currentSort === "desc") {
    list.sort(
      (a, b) =>
        b.people / b.capacity -
        a.people / a.capacity
    );
  }

  if (currentSort === "floor_asc") {
    list.sort(
      (a, b) =>
        parseInt(a.floor) -
        parseInt(b.floor)
    );
  }

  if (currentSort === "floor_desc") {
    list.sort(
      (a, b) =>
        parseInt(b.floor) -
        parseInt(a.floor)
    );
  }

  grid.innerHTML = "";

  list.forEach(item => {

    const percent =
      Math.min(100, Math.round(
        item.people /
        item.capacity *
        100
      ));

    const card =
      document.createElement("article");

    card.className =
      "card " + item.occupancy;

    card.innerHTML = `
          <div class="card-top">

            <div>

              <p class="floor">
                ${item.floor}
              </p>

              <h3>
                ${item.name}
              </h3>

            </div>

            <span
              class="badge ${item.occupancy}"
            >
              ${labels[item.occupancy]}
            </span>

          </div>

          <div class="people">

            <strong>
              ${item.people}
            </strong>

            <span>
              / ${item.capacity} чел.
            </span>

          </div>

          <div>

            <div class="progress">

              <div
                class="progress-value ${item.occupancy}"
                style="width:${percent}%"
              ></div>

            </div>

            <div class="percentage">
              ${percent}% заполнено
            </div>

            ${item.id === 1 ? '<div class="ai-live-note">● Данные обновляются </div>' : ''}

          </div>
        `;

    grid.appendChild(card);
  });
}

document
  .querySelectorAll(".filter-button")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(".filter-button")
          .forEach(btn =>
            btn.classList.remove("active")
          );

        button.classList.add("active");

        currentFilter =
          button.dataset.filter;

        render();
      }
    );
  });

sortSelect.addEventListener(
  "change",
  () => {

    currentSort =
      sortSelect.value;

    render();
  }
);

render();

