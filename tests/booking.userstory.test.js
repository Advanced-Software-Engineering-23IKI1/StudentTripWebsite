const {
  check_validity_all_persons,
  sendPDF,
  loadCurrentPerson,
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

    <textarea id="disability"></textarea>
    <input type="checkbox" id="disability_present" />
    <textarea id="allergies"></textarea>
    <input type="checkbox" id="allergies_present" />

    <input id="first-name-ec" />
    <input id="last-name-ec" />
    <input id="address-ec" />
    <input id="postal-code-ec" />
    <input id="town-ec" />
    <input id="mobile-ec" />
    <input id="email-ec" />
    <input type="checkbox" id="same_as_emergency_co" />

    <input type="radio" name="flexRadioGenderEmContact" id="male-ec" value="m" />

    <input id="first-name-lg" />
    <input id="last-name-lg" />
    <input id="address-lg" />
    <input id="postal-code-lg" />
    <input id="town-lg" />
    <input id="mobile-lg" />
    <input id="email-lg" />
    <input type="radio" name="flexRadioGenderLegalGu" id="male-lg" value="m" />

    <textarea id="wishes"></textarea>
    <input type="checkbox" id="payment_agreement" />
  `;

  // Important: mock checkValidity (jsdom doesn't enforce HTML5 validation)
  const form = document.querySelector(".needs-validation");
  form.checkValidity = jest.fn(() => true);
}

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  setMinimalDOM();

  // booking setup
  localStorage.setItem("numberOfPersons", JSON.stringify(2));
  localStorage.setItem("studentTrip", JSON.stringify(false));
  localStorage.setItem("tripInfo", JSON.stringify({ trip: "TestTrip" }));
  localStorage.setItem("formInfo", JSON.stringify([{}, {}]));
  sessionStorage.setItem("currentPerson", JSON.stringify(0));

  // mock alert + redirect
  window.alert = jest.fn();
  delete window.location;
  window.location = { replace: jest.fn() };

  // mock fetch
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ success: true }),
    })
  );
});

test("User Story: confirm sends JSON, then clears localStorage and redirects on success", async () => {
  // Fill person 1 into localStorage directly (simplifies UI navigation)
  const formInfo = JSON.parse(localStorage.getItem("formInfo"));
  formInfo[0] = { first_name: "P1", disability: "/", disability_checked: false, allergies: "/", allergies_checked: false,
    first_name_ec:"EC", last_name_ec:"EC", address_ec:"A", postal_code_ec:"1", town_ec:"T", mobile_ec:"0", email_ec:"e", gender_ec:"m",
    first_name_lg:"", last_name_lg:"", address_lg:"", postal_code_lg:"", town_lg:"", mobile_lg:"", email_lg:"", gender_lg:"",
    wishes:"/", soldTheirSoul:true, gender:"m",
    last_name:"X", birthdate:"01/01/2000", address:"Addr", postal_code:"123", town:"Town", mobile:"555", email:"a@a.de", passport_number:"P"
  };
  formInfo[1] = { ...formInfo[0], first_name: "P2" };
  localStorage.setItem("formInfo", JSON.stringify(formInfo));

  // Validation over all persons should pass
  const ok = check_validity_all_persons();
  expect(ok).toBe(true);

  // Send request
  await sendPDF();

  expect(fetch).toHaveBeenCalledTimes(1);
  const [url, opts] = fetch.mock.calls[0];
  expect(url).toBe("send_email.php");
  expect(opts.method).toBe("POST");
  expect(opts.headers["Content-Type"]).toBe("application/json");

  // Cleanup + redirect
  expect(localStorage.getItem("formInfo")).toBe(null);
  expect(localStorage.getItem("numberOfPersons")).toBe(null);
  expect(localStorage.getItem("studentTrip")).toBe(null);
  expect(localStorage.getItem("tripInfo")).toBe(null);
  expect(window.location.replace).toHaveBeenCalledWith("thanks.html");
});

test("User Story error case: when server responds success=false, show alert", async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ success: false, message: "Nope" }),
    })
  );

  await sendPDF();

  expect(window.alert).toHaveBeenCalled();
});