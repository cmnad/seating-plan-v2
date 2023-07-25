const seats = document.querySelectorAll(".seat:not(.unavailable)");
const selectedSeatsContainer = document.getElementById("selected-seats");
const shortcutsLink = document.getElementById("shortcuts-link");
const shortcutsDialog = document.getElementById("shortcuts-dialog");
const closeDialogBtn = document.getElementById("close-dialog-btn");
const continueButton = document.getElementById("continue-button");

let selectedSeats = [];

function updateSelectedSeatsText() {
  if (selectedSeats.length > 0) {
    const seatNames = selectedSeats.map((seat) => seat.name);
    selectedSeatsContainer.textContent =
      "Selected seats: " + seatNames.join(", ");
    selectedSeatsContainer.style.display = "block";
  } else {
    selectedSeatsContainer.textContent = "";
    selectedSeatsContainer.style.display = "none";
  }

  // Update ARIA label for selected seats
  seats.forEach((seat) => {
    const seatName = seat.getAttribute("title").split(" - ")[0];
    const isSelected = selectedSeats.some(
      (selectedSeat) => selectedSeat.name === seatName
    );
    seat.setAttribute("aria-selected", isSelected.toString());
  });
}

function toggleSeatSelection(event) {
  if (
    !this.classList.contains("unavailable") &&
    (event.type === "click" ||
      (event.type === "keydown" &&
        (event.key === "Enter" ||
          event.key === " " ||
          event.key === "Spacebar")))
  ) {
    event.preventDefault();

    const seatElement = this;
    const seatName = seatElement.getAttribute("title").split(" - ")[0];

    if (seatElement.classList.contains("selected")) {
      seatElement.classList.remove("selected");
      const seatIndex = selectedSeats.findIndex(
        (seat) => seat.name === seatName
      );
      selectedSeats.splice(seatIndex, 1);
    } else {
      seatElement.classList.add("selected");
      selectedSeats.push({ name: seatName });
    }

    // Hide/show seat icons
    const icons = seatElement.querySelectorAll("i");
    if (icons.length > 0) {
      icons.forEach((icon) => {
        icon.style.display = seatElement.classList.contains("selected")
          ? "none"
          : "block";
      });
    }

    updateSelectedSeatsText();
  }
}

// Navigate rows using keyboard
function navigateRows(event) {
  if (
    (event.ctrlKey && event.shiftKey && event.key === "ArrowDown") ||
    (event.ctrlKey && event.shiftKey && event.key === "ArrowUp") ||
    event.key === "PageDown" ||
    event.key === "PageUp"
  ) {
    const focusedElement = document.activeElement;
    const seatContainer = focusedElement.closest(".row");

    if (!seatContainer) {
      return;
    }

    const seatsInCurrentRow = seatContainer.querySelectorAll(".seat");
    const currentSeatIndex = Array.from(seatsInCurrentRow).indexOf(
      focusedElement
    );

    let newRow;
    let newSeat;

    if (event.key === "ArrowDown" || event.key === "PageDown") {
      newRow = seatContainer.nextElementSibling;
      if (newRow) {
        newSeat = newRow.querySelectorAll(".seat")[currentSeatIndex];
      }
    } else if (event.key === "ArrowUp" || event.key === "PageUp") {
      newRow = seatContainer.previousElementSibling;
      if (newRow) {
        newSeat = newRow.querySelectorAll(".seat")[currentSeatIndex];
      }
    }

    if (newSeat) {
      newSeat.focus();
    }
  }
}

function openDialog(event) {
  event.preventDefault();
  shortcutsDialog.showModal();
}

function closeDialog() {
  shortcutsDialog.close();
}

// Keyboard shortcuts
function handleKeyDown(event) {
  // Open the dialog
  if ((event.ctrlKey || event.altKey) && event.key === "?") {
    event.preventDefault();
    if (!shortcutsDialog.open) {
      openDialog(event);
    }
  }

  // Navigate to the Continue button when pressing Ctrl + c
  if (event.ctrlKey && event.altKey && event.key === "c") {
    event.preventDefault();
    continueButton.focus();
  }
}

seats.forEach((seat) => {
  seat.addEventListener("click", toggleSeatSelection);
  seat.addEventListener("keydown", toggleSeatSelection);
});

document.addEventListener("keydown", navigateRows);
closeDialogBtn.addEventListener("click", closeDialog);
shortcutsLink.addEventListener("click", function (event) {
  openDialog(event);
});

// Event listener for keyboard shortcuts
document.addEventListener("keydown", handleKeyDown);

// Initialize selected seats
updateSelectedSeatsText();

// Hide the "Open Sandbox" link
const removeWatermark = () => {
  const ids = [];
  const iframes = document.body.querySelectorAll("iframe");
  for (const iframe of iframes) {
    if (iframe.id.startsWith("sb__open-sandbox")) ids.push(iframe.id);
  }
  for (const id of ids) {
    const node = document.createElement("div");
    node.style.setProperty("display", "none", "important");
    node.id = id;
    document.getElementById(id).remove();
    document.body.appendChild(node);
  }
};

removeWatermark();
