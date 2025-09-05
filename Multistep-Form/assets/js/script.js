document.addEventListener("DOMContentLoaded", function () {
    const steps = document.querySelectorAll(".step");
    const personalCard = document.getElementById("personalCard");
    const confirmCard = document.getElementById("confirmCard");
    const selectTestCard = document.getElementById("selectTestCard");
    const instructionCard = document.getElementById("instructionCard");
    const testCard = document.getElementById("testCard");
    const resultCard = document.getElementById("result");

    const inputs = document.querySelectorAll("#personalCard input");
    const testRadios = document.querySelectorAll("#selectTestCard input[type='radio']");
    const prevBtns = document.querySelectorAll(".prevBtn");
    const personalNextBtn = document.querySelector("#personalCard .nextBtn");
    const testNextBtn = document.querySelector("#testCard .nextBtn");
    const testPrevBtn = document.querySelector("#testCard .prevBtn");
    const selecttestNextBtn = document.querySelector("#selectTestCard .nextBtn");
    const submitBtn = document.getElementById("submitBtn");
    const nextBtn = document.querySelectorAll(".nextBtn");
    // const reStartBtn = document.getElementById("reStartBtn");
    let fnameInput = document.getElementById('fname');
    let lnameInput = document.getElementById('lname');
    let dobInput = document.getElementById('dob');
    let prnInput = document.getElementById('PRN');
    let emailInput = document.getElementById('email');

    const questionEl = document.getElementById("question");
    const optionsEls = document.querySelectorAll(".option");
    const optionLabels = document.querySelectorAll("li span");

    let testCompleted = false;
    let currentStep = 0;
    let formData = {
        personalInfo: {},
        selectedTest: '',
        testResults: []
    };
    let currentIndex = 0;
    let questions = [];

    function updateSteps() {
        steps.forEach((step, index) => {
            step.classList.remove("active", "completed");
            if (index < currentStep) {
                step.classList.add("completed");
            }
            if (index === currentStep) {
                step.classList.add("active");
            }
        });
    }

    function showCard(cardToShow) {
        document.querySelectorAll(".form-card").forEach(card => {
            card.classList.remove("active");
        });
        cardToShow.classList.add("active");
    }

    function validatePersonalInfo() {
        const fname = fnameInput.value.trim();
        const lname = lnameInput.value.trim();
        const email = emailInput.value.trim();
        const dob = dobInput.value.trim();
        const prn = prnInput.value.trim();

        const isValid = fname.length >= 3 &&
            lname.length >= 3 &&
            dob !== "" && /^\d{4}-\d{2}-\d{2}$/.test(dob) &&
            prn.length === 6 && /^[0-9]{6}$/.test(prn) &&
            email !== "" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        personalNextBtn.disabled = !isValid;
        if (isValid) {
            formData.personalInfo = { fname, lname, dob, prn, email };
        }
        return isValid;
    }

    function validateTestSelection() {
        const selectedTest = document.querySelector("#selectTestCard input[type='radio']:checked");
        const isValid = selectedTest !== null;

        selecttestNextBtn.disabled = !isValid;
        if (isValid) {
            formData.selectedTest = selectedTest.value;
        }
        return isValid;
    }

    inputs.forEach(input => {
        input.addEventListener("input", validatePersonalInfo);
    });


    testRadios.forEach(radio => {
        radio.addEventListener("change", validateTestSelection);
    });

    nextBtn.forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            if (currentStep === 0) {
                if (!validatePersonalInfo()) {
                    return;
                }
                showCard(confirmCard);
                document.getElementById("c_fullname").textContent = formData.personalInfo.fname + " " + formData.personalInfo.lname;
                document.getElementById("c_dob").textContent = formData.personalInfo.dob;
                document.getElementById("c_PRN").textContent = formData.personalInfo.prn;

                localStorage.setItem("formData", JSON.stringify(formData));

                currentStep++;
                updateSteps();
            } else if (currentStep === 1) {
                showCard(selectTestCard);
                currentStep++;
                updateSteps();
            }
            else if (currentStep === 2) {
                if (!validateTestSelection()) {
                    return;
                }
                showCard(instructionCard);
                localStorage.setItem("formData", JSON.stringify(formData));
                currentStep++;
                updateSteps();
            }
            else if (currentStep === 3) {
                fetch("assets/js/questions.json")
                    .then(res => res.json())
                    .then(data => {
                        questions = data.tests[formData.selectedTest].questions;
                        currentIndex = 0;
                        showQuestion();
                        showCard(testCard);
                        currentStep++;
                        updateSteps();
                        // countdown(60);
                    });
                countdown(60);
            } else if (currentStep === 4) {
                if (!validateTestAnswer()) return;

                let selectedIndex = null;
                optionsEls.forEach((opt, i) => {
                    if (opt.checked) selectedIndex = i;
                });

                const currentQuestion = questions[currentIndex];
                formData.testResults.push({
                    question: currentQuestion.question,
                    selectedOption: currentQuestion.options[selectedIndex],
                    correctAnswer: currentQuestion.options[currentQuestion.correctAnswer],
                    isCorrect: selectedIndex === currentQuestion.correctAnswer
                });
                if (currentIndex < questions.length - 1) {
                    currentIndex++;
                    showQuestion();
                }
            }
        })
    });
    prevBtns.forEach(prevBtn => {
        prevBtn.addEventListener("click", (event) => {
            event.preventDefault();
            if (currentStep === 1) {
                showCard(personalCard);
                currentStep--;
                updateSteps();
            } else if (currentStep === 2) {
                showCard(confirmCard);
                currentStep--;
                updateSteps();
            } else if (currentStep === 3) {
                showCard(selectTestCard);
                currentStep--;
                updateSteps();
            } else if (currentStep === 4) {
                showCard(instructionCard);
                currentStep--;
                updateSteps();
            } else if (currentStep === 5) {
                showCard(testCard);
                currentStep--;
                updateSteps();
            }
        });
    });

    function validateTestAnswer() {
        const isChecked = document.querySelector("#testCard input[type='radio']:checked") !== null;
        testNextBtn.disabled = !isChecked;
        submitBtn.disabled = !isChecked;
        return isChecked;
    }

    function showQuestion() {
        const q = questions[currentIndex];
        questionEl.textContent = `${q.id}. ${q.question}`;

        q.options.forEach((opt, i) => {
            optionLabels[i].textContent = opt;
            optionsEls[i].checked = false;
        });

        if (currentIndex === questions.length - 1) {
            submitBtn.style.display = "block";
            document.querySelector(".checkbox-grp").style.display = "block";
            testNextBtn.style.display = "none";
        } else {
            testNextBtn.style.display = "block";
            submitBtn.style.display = "none";
            document.querySelector(".checkbox-grp").style.display = "none";
        }
        testNextBtn.disabled = true;
        submitBtn.disabled = true;
    }

    optionsEls.forEach(opt => {
        opt.addEventListener("change", validateTestAnswer);
    });

    submitBtn.addEventListener("click", function (event) {
        event.preventDefault();
        if (!validateTestAnswer()) {
            return;
        }

        testCompleted = true;

        let selectedIndex = null;
        optionsEls.forEach((opt, i) => {
            if (opt.checked) selectedIndex = i;
        });

        const currentQuestion = questions[currentIndex];
        formData.testResults.push({
            question: currentQuestion.question,
            selectedOption: currentQuestion.options[selectedIndex],
            correctAnswer: currentQuestion.options[currentQuestion.correctAnswer],
            isCorrect: selectedIndex === currentQuestion.correctAnswer
        });

        showCard(resultCard);
        currentStep++;
        updateSteps();

        localStorage.setItem("formData", JSON.stringify(formData));

        const score = formData.testResults.filter(r => r.isCorrect).length * 10;
        const maxScore = questions.length * 10;
        scoreChart("marks-container", score, maxScore);

        const solutionsContainer = document.getElementById("testSolutions");
        solutionsContainer.innerHTML = "";

        formData.testResults.forEach((result, index) => {
            const div = document.createElement("div");
            div.classList.add("solution-item");
            div.innerHTML = `
            <p><strong>Q${index + 1}:</strong> ${result.question}</p>
            <p>Selected Answer: <span style="color:${result.isCorrect ? 'green' : 'red'}">${result.selectedOption}</span></p>
            <p>Correct Answer: <span style="color:green">${result.correctAnswer}</span></p>
            <hr>
        `;
            solutionsContainer.appendChild(div);
        });
    });

    testPrevBtn.addEventListener("click", (event) => {
        event.preventDefault();

        if (currentIndex > 0) {
            currentIndex--;
            showQuestion();
            showCard(testCard);
        } else {
            showCard(instructionCard);
            currentStep--;
            updateSteps();
            currentIndex = 0;
        }
    });

    function countdown(durationInSeconds) {
        let seconds = durationInSeconds;

        const counter = document.getElementById("counter");
        const timer = setInterval(() => {
            const min = Math.floor(seconds / 60);
            const sec = seconds % 60;

            counter.textContent = `${min}:${sec < 10 ? "0" : ""}${sec}`;

            if (seconds <= 0) {
                clearInterval(timer);
                if (!testCompleted) {
                    showCard(resultCard);
                    currentStep++;
                    updateSteps();
                    document.getElementById("marks-container").style.display = "none";
                    document.querySelector(".failedRow").style.display = "block";
                    counter.textContent = "";
                }
            }

            seconds--;
        }, 1000);
    }

    function scoreChart(containerId, score, maxScore) {
        Highcharts.chart(containerId, {
            chart: {
                type: 'gauge',
                backgroundColor: '#fff',
            },
            title: {
                text: 'Your Score',
                style: { color: '#000' }
            },
            pane: {
                startAngle: -90,
                endAngle: 90,
                background: [{
                    backgroundColor: '#fff',
                    borderWidth: 0,
                    outerRadius: '50%'
                }]
            },
            yAxis: {
                min: 0,
                max: maxScore,
                tickInterval: 10,
                lineColor: '#000',
                labels: {
                    style: { color: '#000' }
                },
                plotBands: [{
                    from: 0,
                    to: maxScore * 0.3,
                    color: '#DF5353' 
                }, {
                    from: maxScore * 0.3,
                    to: maxScore * 0.75,
                    color: '#DDDF0D' 
                }, {
                    from: maxScore * 0.75,
                    to: maxScore,
                    color: '#55BF3B' 
                }]
            },
            series: [{
                name: 'Score',
                data: [score],
                tooltip: {
                    valueSuffix: ' points'
                },
                dataLabels: {
                    format: '<div style="text-align:center"><span style="font-size:20px;color:#000">{y} / ' + maxScore + '</span><br/><span style="font-size:14px;color: #000">Points</span></div>'
                }
            }]
        });
    }

    validatePersonalInfo();
    validateTestSelection();
    updateSteps();
    showCard(personalCard);
});

