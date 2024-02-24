const staff = [
  {
    id: 1,
    name: "Alex Rosetta",
    email: "alexyrosetta@egmail.com",
    image: "./images/staff1.svg",
  },
  {
    id: 2,
    name: "Maria July",
    email: "mariajuly@egmail.com",
    image: "./images/staff2.svg",
  },
];

const services = [
  {
    id: 1,
    name: "Oral hygiene",
    image: "./images/service1.svg",
    duration: "1 hour",
    price: 50.0,
  },
  {
    id: 2,
    name: "Implants",
    image: "./images/service2.svg",
    duration: "1 hour 30 minutes",
    price: 120.0,
  },
  {
    id: 3,
    name: "Check up",
    image: "./images/service3.svg",
    duration: "1 hour 12 minutes",
    price: 140.0,
  },
];

const date = ["2022-03-04", "2022-03-05", "2022-03-06"];
const timeSlots = [
  {
    start_time: "09:00",
    end_time: "09:30",
  },
  {
    start_time: "09:30",
    end_time: "10:00",
  },
];

const staffCardsContainer = document.getElementById("staffCards");
const serviceCardsContainer = document.getElementById("serviceCards");
const nextButton = document.getElementById("nextButton");
const backButton = document.getElementById("backButton");
const error = document.getElementById("error");
const select = document.querySelector(".select");
const sidebarServiceLink = document.querySelector(".sidebar_link:nth-child(2)");
const sidebarStaffLink = document.querySelector(".sidebar_link:nth-child(1)");
const sidebarDateLink = document.querySelector(".sidebar_link:nth-child(3)");
const sidebarconfLink = document.querySelector(".sidebar_link:nth-child(4)");
const calendar = document.getElementById("calendar");
const prevMonthButton = document.getElementById("prevMonth");
const nextMonthButton = document.getElementById("nextMonth");
const currentMonthYear = document.getElementById("currentMonthYear");
const calendarDays = document.getElementById("calendarDays");
const calendarWeekdays = document.querySelector(".calendar-weekdays");
const time = document.querySelector(".time");
const datecontainer = document.querySelector(".datecontainer");
const resultContainer = document.querySelector(".result");
const timeSection = document.getElementById("timeSection");
const confirmContainer = document.getElementById("confirmcontainer");
const inputFillModal = document.getElementById("inputFillModal");
const confirmInputFillButton = document.getElementById("confirmInputFill");
const successfulModal = document.getElementById("successfulModal");
const done_icon_one = document.querySelector(".done_icon_one");
const done_icon_two = document.querySelector(".done_icon_two");
const done_icon_three = document.querySelector(".done_icon_three");

let currentDate = new Date();
let currentStep = 1;
let selectedStaff = [];
let selectedService = [];
let selectedDate = "";
let selectedTime = "";

function hideSteps() {
  const elementsToHide = [
    staffCardsContainer,
    serviceCardsContainer,
    timeSection,
    calendar,
  ];
  elementsToHide.forEach((element) => (element.style.display = "none"));
}

function saveSelectedData(step, data) {
  localStorage.setItem(`step${step}`, JSON.stringify(data));
}

function loadSelectedData(step) {
  const data = localStorage.getItem(`step${step}`);
  return JSON.parse(data);
}

const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="done_icon">
<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
</svg>

`;

function renderCalendar() {
  calendarDays.innerHTML = "";
  calendarWeekdays.innerHTML = "";

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  weekdays.forEach((weekday) => {
    const weekdayElement = document.createElement("div");
    weekdayElement.classList.add("calendar-weekday");
    weekdayElement.textContent = weekday;
    calendarWeekdays.appendChild(weekdayElement);
  });

  const lastDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayIndex = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  for (let i = 1; i <= lastDay; i++) {
    const day = document.createElement("div");
    day.classList.add("calendar-day");
    day.textContent = i;

    day.addEventListener("click", (event) => {
      event.preventDefault();
      const selectedDay = document.querySelector(".calendar-day.selected-day");

      if (selectedDay) {
        selectedDay.classList.remove("selected-day");
      }

      day.classList.add("selected-day");

      const timeSlotsContainer = document.getElementById("timeSlots");
      timeSection.style.display = "none";
      timeSlotsContainer.innerHTML = "";

      const selectedDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        parseInt(day.textContent)
      );
      selectedDate.setDate(selectedDate.getDate() + 1);

      const selectedDateString = selectedDate.toISOString().slice(0, 10);

      time.innerHTML = selectedDateString;
      timeSlots.forEach((timeSlot) => {
        const timeSlotElement = document.createElement("div");
        timeSlotElement.classList.add("time-slot");
        timeSlotElement.textContent = `${timeSlot.start_time}  ${timeSlot.end_time}`;

        timeSlotElement.addEventListener("click", () => {
          const selectedTimeSlot = document.querySelector(
            ".time-slot.selected-time"
          );
          if (selectedTimeSlot) {
            selectedTimeSlot.classList.remove("selected-time");
          }
          timeSlotElement.classList.toggle("selected-time");
        });
        timeSlotsContainer.appendChild(timeSlotElement);
      });
      timeSection.style.display = "block";
    });

    calendarDays.appendChild(day);
  }

  currentMonthYear.textContent = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
  }).format(currentDate);
}

window.addEventListener("load", () => {
  hideSteps();
  renderCalendar();
  staffCardsContainer.style.display = "block";

  currentStep = 1;

  if (!staffCardsContainer.innerHTML) {
    staff.forEach((staffMember) => {
      const card = `
        <div class="card selectstaff" data-id="${staffMember.id}">
          <div class="profil">
            <img src="${staffMember.image}" alt="${staffMember.name}">
          </div>
          <div>
            <h4>${staffMember.name}</h4>
            <p>${staffMember.email}</p>
          </div>
        </div>`;

      staffCardsContainer.innerHTML += card;
    });

    staffCardsContainer.querySelectorAll(".card").forEach((card) => {
      card.addEventListener("click", () => {
        card.classList.toggle("selected");
      });
    });
  }

  nextButton.addEventListener("click", () => {
    switch (currentStep) {
      case 1:
        selectedStaff = [];
        const selectedStaffCards = document.querySelectorAll(
          ".selectstaff.selected"
        );
        selectedStaffCards.forEach((staffCard) => {
          selectedStaff.push(parseInt(staffCard.getAttribute("data-id")));
        });

        if (selectedStaff.length > 0) {
          hideSteps();
          sidebarStaffLink.classList.remove("active");
          sidebarStaffLink.classList.add("done");
          done_icon_one.innerHTML = svgContent;
          sidebarServiceLink.classList.add("active");
          backButton.style.visibility = "visible";
          error.style.visibility = "hidden";
          select.textContent = "Select service";
          serviceCardsContainer.style.display = "block";

          if (!serviceCardsContainer.innerHTML) {
            services.forEach((service) => {
              const card = document.createElement("div");
              card.classList.add("card");
              card.classList.add("service_card");
              card.classList.add("selectservice");
              card.setAttribute("data-id", service.id);

              const div = document.createElement("div");
              div.classList.add("service_div");

              const profileDiv = document.createElement("div");
              profileDiv.classList.add("profil");

              const img = document.createElement("img");
              img.src = `${service.image}`;
              img.alt = service.name;

              profileDiv.appendChild(img);
              div.appendChild(profileDiv);

              const infoDiv = document.createElement("div");
              const name = document.createElement("h4");
              name.textContent = service.name;

              const duration = document.createElement("p");
              duration.textContent = service.duration;

              infoDiv.appendChild(name);
              infoDiv.appendChild(duration);
              div.appendChild(infoDiv);
              card.appendChild(div);

              const servicePrice = document.createElement("p");
              servicePrice.classList.add("servicePrice");
              servicePrice.textContent = `$${service.price}`;

              card.appendChild(servicePrice);

              serviceCardsContainer.appendChild(card);

              card.addEventListener("click", () => {
                card.classList.toggle("selected");
              });
            });
          }

          currentStep = 2;
          saveSelectedData(currentStep, { selectedStaff: selectedStaff });
        } else {
          error.style.visibility = "visible";
        }
        break;
      case 2:
        selectedService = [];
        const selectedServiceCards = document.querySelectorAll(
          ".selectservice.selected"
        );
        selectedServiceCards.forEach((serviceCard) => {
          selectedService.push(parseInt(serviceCard.getAttribute("data-id")));
        });

        if (selectedService.length > 0) {
          hideSteps();
          sidebarServiceLink.classList.remove("active");
          sidebarServiceLink.classList.add("done");
          done_icon_two.innerHTML = svgContent;
          sidebarDateLink.classList.add("active");
          backButton.style.visibility = "visible";
          error.style.visibility = "hidden";
          select.textContent = "Select date & time";
          calendar.style.display = "block";

          currentStep = 3;
          saveSelectedData(currentStep, { selectedService: selectedService });
        } else {
          error.textContent = "Select service.";
          error.style.visibility = "visible";
        }
        break;
      case 3:
        selectedDate = time.textContent;
        selectedTime = document.querySelector(".time-slot.selected-time");
        if (selectedDate && selectedTime) {
          hideSteps();
          sidebarDateLink.classList.remove("active");
          sidebarDateLink.classList.add("done");
          done_icon_three.innerHTML = svgContent;
          sidebarconfLink.classList.add("active");
          backButton.style.visibility = "visible";
          error.style.visibility = "hidden";
          select.textContent = "Confirm details";

          calendar.style.display = "none";
          timeSection.style.display = "none";
          confirmContainer.style.display = "block";

          let totalPrice = 0;
          selectedService.forEach((serviceId) => {
            const selectedService = services.find(
              (service) => service.id === serviceId
            );
            if (selectedService) {
              totalPrice += selectedService.price;
            }
          });

          resultContainer.innerHTML = `
            <p><strong>Staff: </strong>   ${selectedStaff
              .map((staffId) => staff.find((s) => s.id === staffId).name)
              .join(", ")}</p>
            <p><strong>Service: </strong>   ${selectedService
              .map((serviceId) => services.find((s) => s.id === serviceId).name)
              .join(", ")}</p>
            <p><strong>Date & Time: </strong>   ${selectedDate} / ${
            selectedTime.textContent
          }</p>
            <p ><strong>Total Price: </strong>  <span class="price">$${totalPrice.toFixed(
              2
            )} </span> </p>
          `;

          currentStep = 4;
          saveSelectedData(currentStep, {
            selectedDate: selectedDate,
            selectedTime: selectedTime,
          });
        } else {
          error.textContent = "Select date & time.";
          error.style.visibility = "visible";
        }
        break;
      case 4:
        const firstNameInput = document.querySelector(
          'input[type="text"][required][name="firstName"]'
        );
        const lastNameInput = document.querySelector(
          'input[type="text"][required][name="lastName"]'
        );
        const emailInput = document.querySelector(
          'input[type="email"][required][name="email"]'
        );
        const phoneInput = document.querySelector(
          'input[type="tel"][name="phone"]'
        );

        if (
          firstNameInput.value === "" ||
          lastNameInput.value === "" ||
          emailInput.value === ""
        ) {
          inputFillModal.style.display = "block";
        } else {
          const selectedStaffNames = selectedStaff.map(
            (staffId) => staff.find((s) => s.id === staffId).name
          );
          const selectedServiceNames = selectedService.map(
            (serviceId) => services.find((s) => s.id === serviceId).name
          );

          const bookingInfo = {
            selectedStaff: selectedStaffNames.join(", "),
            selectedService: selectedServiceNames.join(", "),
            selectedDate: selectedDate,
            selectedTime: selectedTime.textContent,
            firstName: firstNameInput.value,
            lastName: lastNameInput.value,
            email: emailInput.value,
            phone: phoneInput.value,
          };

          console.log("Booking Information:", bookingInfo);

          successfulModal.style.display = "block";
        }
        break;
      default:
        break;
    }
  });

  confirmInputFillButton.addEventListener("click", () => {
    inputFillModal.style.display = "none";
  });

  const closeSuccessfulModal = document.querySelector(".modal-content .close");

  closeSuccessfulModal.addEventListener("click", () => {
    successfulModal.style.display = "none";

    const inputs = document.querySelectorAll(
      'input[type="text"][required], input[type="email"][required], input[type="tel"]'
    );
    inputs.forEach((input) => {
      input.value = "";
    });

    const selectedStaffCards = document.querySelectorAll(
      ".selectstaff.selected"
    );
    selectedStaffCards.forEach((staffCard) => {
      staffCard.classList.remove("selected");
    });

    const selectedServiceCards = document.querySelectorAll(
      ".selectservice.selected"
    );
    selectedServiceCards.forEach((serviceCard) => {
      serviceCard.classList.remove("selected");
    });

    const selectedDay = document.querySelector(".calendar-day.selected-day");
    if (selectedDay) {
      selectedDay.classList.remove("selected-day");
    }

    const selectedTimeSlot = document.querySelector(".time-slot.selected-time");
    if (selectedTimeSlot) {
      selectedTimeSlot.classList.remove("selected-time");
    }

    hideSteps();
    staffCardsContainer.style.display = "block";
    confirmContainer.style.display = "none";
    select.textContent = "Select staff";
    error.style.visibility = "hidden";
    done_icon_one.innerHTML = 1;
    done_icon_two.innerHTML = 2;
    done_icon_three.innerHTML = 3;
    sidebarStaffLink.classList.add("active");
    sidebarStaffLink.classList.remove("done");
    sidebarServiceLink.classList.remove("active");
    sidebarServiceLink.classList.remove("done");
    sidebarDateLink.classList.remove("active");
    sidebarDateLink.classList.remove("done");
    sidebarconfLink.classList.remove("active");
    sidebarconfLink.classList.remove("done");
    currentStep = 1;
    selectedStaff = [];
    selectedService = [];
    selectedDate = "";
    selectedTime = "";
  });

  backButton.addEventListener("click", () => {
    switch (currentStep) {
      case 2:
        hideSteps();
        sidebarServiceLink.classList.remove("active");
        sidebarServiceLink.classList.remove("done");
        done_icon_one.innerHTML = 1;
        done_icon_two.innerHTML = 2;
        done_icon_three.innerHTML = 3;
        sidebarStaffLink.classList.add("active");
        sidebarStaffLink.classList.remove("done");
        backButton.style.visibility = "hidden";
        error.style.visibility = "hidden";
        select.textContent = "Select staff";
        staffCardsContainer.style.display = "block";

        currentStep = 1;
        selectedStaff = [];
        saveSelectedData(currentStep, {});
        break;
      case 3:
        hideSteps();
        sidebarDateLink.classList.remove("active");
        sidebarDateLink.classList.remove("done");
        sidebarServiceLink.classList.add("active");
        sidebarServiceLink.classList.remove("done");
        done_icon_one.innerHTML = 1;
        done_icon_two.innerHTML = 2;
        done_icon_three.innerHTML = 3;
        backButton.style.visibility = "visible";
        error.style.visibility = "hidden";
        select.textContent = "Select service";
        serviceCardsContainer.style.display = "block";

        currentStep = 2;
        selectedService = [];
        saveSelectedData(currentStep, {});
        break;
      case 4:
        hideSteps();
        sidebarconfLink.classList.remove("active");
        sidebarconfLink.classList.remove("done");
        done_icon_one.innerHTML = 1;
        done_icon_two.innerHTML = 2;
        done_icon_three.innerHTML = 3;
        sidebarDateLink.classList.add("active");
        sidebarDateLink.classList.remove("done");
        backButton.style.visibility = "visible";
        error.style.visibility = "hidden";
        select.textContent = "Select date & time";
        calendar.style.display = "block";
        timeSection.style.display = "block";
        confirmContainer.style.display = "none";
        currentStep = 3;
        selectedDate = "";
        selectedTime = "";
        saveSelectedData(currentStep, {});
        break;
      default:
        break;
    }
  });

  prevMonthButton.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  });

  nextMonthButton.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  });

  renderCalendar();

  const savedStep = loadSelectedData(currentStep);
  if (savedStep) {
    switch (currentStep) {
      case 1:
        savedStep.selectedStaff.forEach((staffId) => {
          const staffCard = document.querySelector(
            `.selectstaff[data-id="${staffId}"]`
          );
          if (staffCard) {
            staffCard.classList.add("selected");
          }
        });
        break;
      case 2:
        savedStep.selectedService.forEach((serviceId) => {
          const serviceCard = document.querySelector(
            `.selectservice[data-id="${serviceId}"]`
          );
          if (serviceCard) {
            serviceCard.classList.add("selected");
          }
        });
        break;
      case 3:
        selectedDate = savedStep.selectedDate;
        selectedTime = savedStep.selectedTime;
        const selectedDay = document.querySelector(
          `.calendar-day[data-day="${selectedDate}"]`
        );
        if (selectedDay) {
          selectedDay.classList.add("selected-day");
        }
        const selectedTimeSlot = document.querySelector(
          `.time-slot[data-time="${selectedTime}"]`
        );
        if (selectedTimeSlot) {
          selectedTimeSlot.classList.add("selected-time");
        }
        break;
      default:
        break;
    }
  }
});
