document.addEventListener("DOMContentLoaded", function () {
    let fnameInput = document.getElementById('fname');
    let lnameInput = document.getElementById('lname');
    let dobInput = document.getElementById('dob');
    let prnInput = document.getElementById('PRN');
    let emailInput = document.getElementById('email');
    const rules = {
        fname: {
            regex: /^[a-zA-Z\s]{3,}$/, emptyMsg: "First Name is required", invalidMsg: "First Name must be at least 3 letters"
        },
        lname: {
            regex: /^[a-zA-Z\s]{3,}$/, emptyMsg: "Last Name is required", invalidMsg: "Last Name must be at least 3 letters"
        },
        prn: {
            regex: /^[0-9]{6}$/, emptyMsg: "PRN is required", invalidMsg: "PRN number should be 6 digits"
        },
        dob: {
            regex: /^\d{4}-\d{2}-\d{2}$/, emptyMsg: "Date of Birth is required", invalidMsg: "Invalid Date of Birth format (YYYY-MM-DD)"
        },
        email: {
            regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, emptyMsg: "Email is required", invalidMsg: "Email is invalid"
        },
    };

    function alphabetOnly(inputElement) {
        inputElement.addEventListener("input", function () {
            this.value = this.value.replace(/[^a-zA-Z]/g, "");
        });
    }
    alphabetOnly(fnameInput);
    alphabetOnly(lnameInput);

    function numberOnly(inputElement) {
        inputElement.addEventListener("input", function () {
            this.value = this.value.replace(/[^0-9]/g, '');
            if (this.value.length > 6) {
                this.value = this.value.slice(0, 6);
            }

        });
    }
    numberOnly(prnInput);

    function validateField(field, rule) {
        let fieldError = field.parentElement.querySelector(".error-msg");
        const value = field.value.trim();

        if (value === "") {
            if (fieldError) {
                fieldError.textContent = `*${rule.emptyMsg}`;
            }
            return false;
        } else if (rule.regex && !rule.regex.test(value)) {
            if (fieldError) {
                fieldError.textContent = `*${rule.invalidMsg}`;
            }
            return false;
        } else {
            if (fieldError) {
                fieldError.textContent = "";
            }
            return true;
        }
    }

    function blurEvent(field, rule) {
        field.addEventListener("blur", () => {
            validateField(field, rule);
        });
    }

    function focusEvent(fieldName) {
        fieldName.addEventListener("focus", () => {
            const fieldError = fieldName.parentElement.querySelector(".error-msg");
            if (fieldError) {
                fieldError.textContent = "";
            }
        });
    }


    blurEvent(fnameInput, rules.fname);
    blurEvent(lnameInput, rules.lname);
    blurEvent(prnInput, rules.prn);
    blurEvent(dobInput, rules.dob);
    blurEvent(emailInput, rules.email);

    focusEvent(fnameInput);
    focusEvent(lnameInput);
    focusEvent(prnInput);
    focusEvent(dobInput);
    focusEvent(emailInput);



    function setAttr() {
        var d = new Date();
        var curr_date = d.getDate();
        var curr_month = d.getMonth() + 1;
        if (curr_month < 10)
            curr_month = '0' + curr_month;

        if (curr_date < 10)
            curr_date = '0' + curr_date;

        var curr_year = d.getFullYear();
        var d1 = curr_year + "-" + curr_month + "-" + curr_date;
        console.log(d1);
        document.getElementById("dob").setAttribute("max", d1);

    }
    setAttr(dobInput);

});

// export { validateField, rules, fnameInput, lnameInput, dobInput, prnInput };