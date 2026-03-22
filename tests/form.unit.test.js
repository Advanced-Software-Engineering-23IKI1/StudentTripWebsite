const {
  change_visibility,
  same_as_ec,
  setPersonInfo,
  loadCurrentPerson,
} = require("../assets/js/form.js");

function setBaseDOM() {
  document.body.innerHTML = `
    <input id="first-name" />
    <input id="last-name" />
    <input id="birthdate" />
    <input id="address" />
    <input id="postal-code" />
    <input id="town" />
    <input id="mobile" />
    <input id="email" />
    <input id="passport-number" />

    <input type="radio" name="flexRadioGender" id="male" value="m" />
    <input type="radio" name="flexRadioGender" id="female" value="f" />
    <input type="radio" name="flexRadioGender" id="diverse" value="d" />

    <input type="checkbox" id="disability_present" />
    <textarea id="disability"></textarea>
    <div data-disability hidden></div>

    <input type="checkbox" id="allergies_present" />
    <textarea id="allergies"></textarea>
    <div data-allergies hidden></div>

    <input id="first-name-ec" />
    <input id="last-name-ec" />
    <input id="address-ec" />
    <input id="postal-code-ec" />
    <input id="town-ec" />
    <input id="mobile-ec" />
    <input id="email-ec" />
    <input type="checkbox" id="same_as_emergency_co" />

    <input type="radio" name="flexRadioGenderEmContact" id="male-ec" value="m" />
    <input type="radio" name="flexRadioGenderEmContact" id="female-ec" value="f" />
    <input type="radio" name="flexRadioGenderEmContact" id="diverse-ec" value="d" />

    <input id="first-name-lg" />
    <input id="last-name-lg" />
    <input id="address-lg" />
    <input id="postal-code-lg" />
    <input id="town-lg" />
    <input id="mobile-lg" />
    <input id="email-lg" />

    <input type="radio" name="flexRadioGenderLegalGu" id="male-lg" value="m" />
    <input type="radio" name="flexRadioGenderLegalGu" id="female-lg" value="f" />
    <input type="radio" name="flexRadioGenderLegalGu" id="diverse-lg" value="d" />

    <textarea id="wishes"></textarea>
    <input type="checkbox" id="payment_agreement" />
  `;
}

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  setBaseDOM();
  localStorage.setItem("formInfo", JSON.stringify([{}, {}]));
});

test("change_visibility shows elements and adds required when checked=true", () => {
  // create two elements with the attribute selector used by change_visibility
  const a = document.createElement("input");
  a.setAttribute("data-legal", "");
  a.setAttribute("hidden", "");
  document.body.appendChild(a);

  const b = document.createElement("textarea");
  b.setAttribute("data-legal", "");
  b.setAttribute("hidden", "");
  document.body.appendChild(b);

  change_visibility(true, "data-legal");

  expect(a.hasAttribute("hidden")).toBe(false);
  expect(a.hasAttribute("required")).toBe(true);
  expect(b.hasAttribute("hidden")).toBe(false);
  expect(b.hasAttribute("required")).toBe(true);

  change_visibility(false, "data-legal");

  expect(a.hasAttribute("hidden")).toBe(true);
  expect(a.hasAttribute("required")).toBe(false);
});

test("same_as_ec copies emergency contact fields into legal guardian when checked=true", () => {
  document.getElementById("first-name-ec").value = "Eva";
  document.getElementById("last-name-ec").value = "Example";
  document.getElementById("address-ec").value = "Street 1";
  document.getElementById("postal-code-ec").value = "12345";
  document.getElementById("town-ec").value = "Berlin";
  document.getElementById("mobile-ec").value = "0123";
  document.getElementById("email-ec").value = "eva@example.com";
  document.getElementById("female-ec").checked = true;

  same_as_ec(true);

  expect(document.getElementById("first-name-lg").value).toBe("Eva");
  expect(document.getElementById("email-lg").value).toBe("eva@example.com");
  expect(document.getElementById("female-lg").checked).toBe(true);

  same_as_ec(false);

  expect(document.getElementById("first-name-lg").value).toBe("");
  expect(document.getElementById("female-lg").checked).toBe(false);
});

test("setPersonInfo stores current form values into localStorage formInfo[index]", () => {
  document.getElementById("first-name").value = "Max";
  document.getElementById("last-name").value = "Mustermann";
  document.getElementById("email").value = "max@test.com";
  document.getElementById("passport-number").value = "L01X00T47";
  document.getElementById("male").checked = true;

  document.getElementById("payment_agreement").checked = true;

  setPersonInfo(0);

  const saved = JSON.parse(localStorage.getItem("formInfo"))[0];
  expect(saved.first_name).toBe("Max");
  expect(saved.gender).toBe("m");
  expect(saved.soldTheirSoul).toBe(true);
});

test("loadCurrentPerson loads person data from localStorage into DOM fields", () => {
  const formInfo = JSON.parse(localStorage.getItem("formInfo"));
  formInfo[1] = {
    first_name: "Anna",
    last_name: "A",
    birthdate: "01/01/2000",
    address: "Addr",
    postal_code: "11111",
    town: "Town",
    mobile: "999",
    email: "anna@test.com",
    passport_number: "P123",
    gender: "f",
    disability: "/",
    disability_checked: false,
    allergies: "/",
    allergies_checked: false,
    first_name_ec: "EC",
    last_name_ec: "EC",
    address_ec: "ECAddr",
    postal_code_ec: "22222",
    town_ec: "ECTown",
    mobile_ec: "555",
    email_ec: "ec@test.com",
    gender_ec: "m",
    first_name_lg: "",
    last_name_lg: "",
    address_lg: "",
    postal_code_lg: "",
    town_lg: "",
    mobile_lg: "",
    email_lg: "",
    gender_lg: "",
    wishes: "/",
    soldTheirSoul: false,
  };
  localStorage.setItem("formInfo", JSON.stringify(formInfo));

  loadCurrentPerson(1);

  expect(document.getElementById("first-name").value).toBe("Anna");
  expect(document.getElementById("female").checked).toBe(true);
  expect(document.getElementById("email").value).toBe("anna@test.com");
});