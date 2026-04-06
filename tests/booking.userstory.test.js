const {
  check_validity_all_persons,
  sendPDF,
} = require("../assets/js/form.js");

function setMinimalDOM() {
  document.body.innerHTML = `
    <form class="needs-validation"></form>

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

    <textarea id="disability"></textarea>
    <input type="checkbox" id="disability_present" />
    <div data-disability hidden></div>

    <textarea id="allergies"></textarea>
    <input type="checkbox" id="allergies_present" />
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

    <input type="file" id="file-upload" />
  `;

  const form = document.querySelector(".needs-validation");
  form.checkValidity = jest.fn(() => true);
}

function createPerson(firstName) {
  return {
    first_name: firstName,
    last_name: "X",
    birthdate: "2000-01-01",
    address: "Addr",
    postal_code: "12345",
    town: "Town",
    mobile: "555",
    email: "a@a.de",
    passport_number: "P123",
    gender: "m",
    disability: "/",
    disability_checked: false,
    allergies: "/",
    allergies_checked: false,
    first_name_ec: "EC",
    last_name_ec: "Person",
    address_ec: "A",
    postal_code_ec: "1",
    town_ec: "T",
    mobile_ec: "0",
    email_ec: "ec@test.de",
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
    soldTheirSoul: true,
  };
}

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  setMinimalDOM();

  localStorage.setItem("participants", JSON.stringify(2));
  localStorage.setItem("studentTrip", JSON.stringify(false));
  localStorage.setItem(
    "tripInfo",
    JSON.stringify({
      otherInformation: { tripType: "Language Trip" },
    })
  );
  localStorage.setItem("formInfo", JSON.stringify([{}, {}]));
  sessionStorage.setItem("currentPerson", JSON.stringify(0));

  window.alert = jest.fn();

  delete window.location;
  window.location = { replace: jest.fn() };

  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ success: true }),
    })
  );
});

test("User Story: confirm validates all persons, sends FormData, clears localStorage and redirects on success", async () => {
  const formInfo = [createPerson("P1"), createPerson("P2")];
  localStorage.setItem("formInfo", JSON.stringify(formInfo));

  const ok = check_validity_all_persons();
  expect(ok).toBe(true);

  await sendPDF();

  expect(fetch).toHaveBeenCalledTimes(1);

  const [url, opts] = fetch.mock.calls[0];
  expect(url).toBe("../send_email.php");
  expect(opts.method).toBe("POST");
  expect(opts.body).toBeInstanceOf(FormData);

  expect(localStorage.getItem("formInfo")).toBe(null);
  expect(localStorage.getItem("participants")).toBe(null);
  expect(localStorage.getItem("studentTrip")).toBe(null);
  expect(localStorage.getItem("tripInfo")).toBe(null);
  expect(window.location.replace).toHaveBeenCalledWith("../thanks/index.html");
});

test("User Story error case: when server responds success=false, show alert and do not redirect", async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ success: false, message: "Nope" }),
    })
  );

  await sendPDF();

  expect(window.alert).toHaveBeenCalledWith("Error: Nope");
  expect(window.location.replace).not.toHaveBeenCalled();
});