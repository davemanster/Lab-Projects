const monthSelect1 = document.getElementById('month1');
const yearInput1 = document.getElementById('year1');
const monthSelect2 = document.getElementById('month2');
const yearInput2 = document.getElementById('year2');
const monthSelect3 = document.getElementById('month3');
const yearInput3 = document.getElementById('year3');
const generateBtn = document.getElementById('generate-btn');
const clearBtn = document.getElementById('clear-btn');
const entriesContainer = document.getElementById('entries-container');
const calendarContainer = document.getElementById('calendar-container');
const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
    e.preventDefault();
});

generateBtn.addEventListener('click', generateCalendar);
clearBtn.addEventListener('click', clearCalendar);

function generateCalendar() {
    const month1 = parseInt(monthSelect1.value);
    const year1 = parseInt(yearInput1.value);
    const month2 = parseInt(monthSelect2.value);
    const year2 = parseInt(yearInput2.value);
    const month3 = parseInt(monthSelect3.value);
    const year3 = parseInt(yearInput3.value);
    const calendar = createCalendar(month1, year1, month2, year2, month3, year3);

    const table = document.createElement('table');
    const tbody = document.createElement('tbody');

    calendar.forEach((month) => {
        const monthHeader = document.createElement('tr');
        const th = document.createElement('th');
        th.colSpan = 7;
        th.textContent = getMonthName(month.month) + ' ' + month.year;
        monthHeader.appendChild(th);
        tbody.appendChild(monthHeader);

        // Create day of the week headers
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const thRow = document.createElement('tr');
        daysOfWeek.forEach((day) => {
            const th = document.createElement('th');
            th.textContent = day;
            thRow.appendChild(th);
        });
        tbody.appendChild(thRow);

        // Create calendar body
        month.weeks.forEach((week) => {
            const tr = document.createElement('tr');
            week.forEach((day, index) => {
                const td = document.createElement('td');
                if (day !== 0) {
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.value = day.toString();
                    td.appendChild(input);

                    const select = document.createElement('select');
                    let previousValue = '';
                    let previousQuantity = 0;
                    select.addEventListener('change', (e) => {
                        const entryId = e.target.value;
                        const entry = document.querySelector(`.entry#${entryId}`);
                        if (entry) {
                            const colorInput = entry.querySelector('input[type="color"]');
                            const color = colorInput.value;
                            const useColorInput = entry.querySelector('input[type="checkbox"]');
                            const useColor = useColorInput.checked;
                            if (useColor) {
                                if (color) {
                                    td.style.backgroundColor = color;
                                } else {
                                    td.style.backgroundColor = '';
                                }
                            } else {
                                td.style.backgroundColor = '';
                            }
                            const quantityInput = entry.querySelector('input[type="number"]');
                            const quantity = parseInt(quantityInput.value);
                            if (previousValue !== '') {
                                const previousEntry = document.querySelector(`.entry#${previousValue}`);
                                if (previousEntry) {
                                    const previousQuantityInput = previousEntry.querySelector('input[type="number"]');
                                    previousQuantityInput.value = previousQuantity;
                                }
                            }
                            if (entryId !== '') {
                                if (quantity > 0) {
                                    quantityInput.value = quantity - 1;
                                }
                            } else {
                                if (previousValue !== '') {
                                    const previousEntry = document.querySelector(`.entry#${previousValue}`);
                                    if (previousEntry) {
                                        const previousQuantityInput = previousEntry.querySelector('input[type="number"]');
                                        previousQuantityInput.value = previousQuantity + 1;
                                    }
                                }
                            }
                            previousValue = entryId;
                            previousQuantity = quantity;
                        }
                    });
                    const options = entriesContainer.querySelectorAll('.entry');
                    const blankOption = document.createElement('option');
                    blankOption.value = '';
                    blankOption.textContent = '';
                    select.appendChild(blankOption);
                    options.forEach((option) => {
                        const optionValue = option.querySelector('input[type="text"]').value;
                        const optionId = option.id;
                        const optionElement = document.createElement('option');
                        optionElement.value = optionId;
                        optionElement.textContent = optionValue;
                        select.appendChild(optionElement);
                    });
                    td.appendChild(select);
                }
                if (index === 5 || index === 6) {
                    td.classList.add('weekend');
                }
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
    });

    table.appendChild(tbody);
    calendarContainer.innerHTML = '';
    calendarContainer.appendChild(table);
}

function clearCalendar() {
    calendarContainer.innerHTML = '';
    const entries = entriesContainer.querySelectorAll('.entry');
    entries.forEach((entry) => {
        const quantityInput = entry.querySelector('input[type="number"]');
        quantityInput.value = 0;
        const colorInput = entry.querySelector('input[type="color"]');
        colorInput.value = '';
        const useColorInput = entry.querySelector('input[type="checkbox"]');
        useColorInput.checked = false;
    });
}

function createCalendar(month1, year1, month2, year2, month3, year3) {
    const calendar = [];

    // Create months
    const monthData1 = createMonth(month1, year1);
    const monthData2 = createMonth(month2, year2);
    const monthData3 = createMonth(month3, year3);

    // Add months to calendar
    calendar.push(monthData1);
    calendar.push(monthData2);
    calendar.push(monthData3);

    return calendar;
}

function createMonth(month, year) {
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const weeks = [];

    // Create first week
    const firstWeek = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
        firstWeek.push(0);
    }
    let day = 1;
    for (let i = firstDayOfWeek; i < 7; i++) {
        firstWeek.push(day);
        day++;
    }
    weeks.push(firstWeek);

    // Create days for each week
    while (day <= daysInMonth) {
        const week = [];
        for (let i = 0; i < 7; i++) {
            if (day <= daysInMonth) {
                week.push(day);
                day++;
            } else {
                week.push(0);
            }
        }
        weeks.push(week);
    }

    return { month, year, weeks };
}

function getMonthName(month) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return monthNames[month];
}
