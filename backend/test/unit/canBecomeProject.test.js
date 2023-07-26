const { expect } = require("chai")
describe("canBecomeProject", function () {
    let problems, solutions, membership, tokenManagement, projects, tasks
    let accounts, projectManagerAccount, offerId
    let x

    before(async function () {
        const TokenManagement = await ethers.getContractFactory("TokenManagement")
        const Membership = await ethers.getContractFactory("Membership")
        const Problems = await ethers.getContractFactory("Problems")
        const Solutions = await ethers.getContractFactory("Solutions")
        const Projects = await ethers.getContractFactory("Projects")
        const Tasks = await ethers.getContractFactory("Tasks")

        tokenManagement = await TokenManagement.deploy()
        await tokenManagement.deployed()

        membership = await Membership.deploy(tokenManagement.address)
        await membership.deployed()

        problems = await Problems.deploy(membership.address)
        await problems.deployed()

        solutions = await Solutions.deploy(membership.address, problems.address)
        await solutions.deployed()

        projects = await Projects.deploy(
            membership.address,
            solutions.address,
            tokenManagement.address
        )
        await projects.deployed()

        tasks = await Tasks.deploy(membership.address, projects.address, tokenManagement.address)
        await tasks.deployed()

        accounts = await ethers.getSigners()
        x = 0
    })
    beforeEach(async function () {
        x = x + 1
        await problems.connect(accounts[0]).raiseProblem(String(x))
        const problemId = await problems.getProblemCounter()

        for (let i = 1; i < 4; i++) {
            await problems.connect(accounts[i]).rateProblem(problemId, 9)
        }
    })

    it("Should propose a solution", async function () {
        const problemId = await problems.getProblemCounter()
        await solutions.connect(accounts[1]).proposeSolution(problemId, "Solution 1")
        const solutionId = await solutions.getSolutionCounter()
        expect((await solutions.viewSolutionDetails(solutionId))[3]).to.equal("Solution 1")
    })

    it("Should rate the solution", async function () {
        const solutionId = await solutions.getSolutionCounter()

        for (let i = 2; i < 3; i++) {
            await solutions.connect(accounts[i]).rateSolution(solutionId, 6)
        }
        expect(await solutions.canBecomeProject(solutionId)).to.be.false

        for (let i = 4; i < 7; i++) {
            await solutions.connect(accounts[i]).rateSolution(solutionId, 9)
        }
        expect(await solutions.canBecomeProject(solutionId)).to.be.true
    })

    describe("canBecomeProject-test", function () {
        it("Should not be able to become a project if rating average is less than MIN_RATING_AVERAGE", async function () {
            const problemId = await problems.getProblemCounter()
            await solutions.connect(accounts[1]).proposeSolution(problemId, "Solution 2")
            const solutionId = await solutions.getSolutionCounter()

            for (let i = 2; i < 4; i++) {
                await solutions.connect(accounts[i]).rateSolution(solutionId, 4) // less than MIN_RATING_AVERAGE
            }

            expect(await solutions.canBecomeProject(solutionId)).to.be.false
        })

        it("Should not be able to become a project if rating count is less than MIN_RATING_COUNT", async function () {
            const problemId = await problems.getProblemCounter()
            await solutions.connect(accounts[1]).proposeSolution(problemId, "Solution 3")
            const solutionId = await solutions.getSolutionCounter()

            await solutions.connect(accounts[2]).rateSolution(solutionId, 9) // Only one rater

            expect(await solutions.canBecomeProject(solutionId)).to.be.false
        })

        it("Should not be able to become a project if total problem ratings are less than MIN_TOTAL_RATE_COUNT", async function () {
            const problemId = await problems.getProblemCounter()
            await solutions.connect(accounts[1]).proposeSolution(problemId, "Solution 4")
            const solutionId = await solutions.getSolutionCounter()

            for (let i = 2; i < 4; i++) {
                await solutions.connect(accounts[i]).rateSolution(solutionId, 9) // 2 raters but less than MIN_TOTAL_RATE_COUNT
            }

            expect(await solutions.canBecomeProject(solutionId)).to.be.false
        })

        it("Should be able to become a project if all criteria are met with same rating: 7", async function () {
            const problemId = await problems.getProblemCounter()
            console.log(problemId)
            await solutions.connect(accounts[1]).proposeSolution(problemId, "Solution 5")
            const solutionId = await solutions.getSolutionCounter()
            console.log(solutionId)

            for (let i = 2; i < 6; i++) {
                await solutions.connect(accounts[i]).rateSolution(solutionId, 7)
            }

            expect(await solutions.canBecomeProject(solutionId)).to.be.true
        })

        it("Should be able to become a project if all criteria are met with same rating: 8", async function () {
            const problemId = await problems.getProblemCounter()
            await solutions.connect(accounts[1]).proposeSolution(problemId, "Solution 6")
            const solutionId = await solutions.getSolutionCounter()

            for (let i = 2; i < 6; i++) {
                await solutions.connect(accounts[i]).rateSolution(solutionId, 8)
            }

            expect(await solutions.canBecomeProject(solutionId)).to.be.true
        })
        it("Should be able to become a project if all criteria are met with same rating: 9", async function () {
            const problemId = await problems.getProblemCounter()
            await solutions.connect(accounts[1]).proposeSolution(problemId, "Solution 7")
            const solutionId = await solutions.getSolutionCounter()

            for (let i = 2; i < 6; i++) {
                await solutions.connect(accounts[i]).rateSolution(solutionId, 9)
            }

            expect(await solutions.canBecomeProject(solutionId)).to.be.true
        })
        it("Should be able to become a project if all criteria are met with difrent rating", async function () {
            const problemId = await problems.getProblemCounter()
            await solutions.connect(accounts[1]).proposeSolution(problemId, "Solution 9")
            const solutionId = await solutions.getSolutionCounter()

            for (let i = 7; i < 11; i++) {
                await solutions.connect(accounts[i]).rateSolution(solutionId, i)
            }

            expect(await solutions.canBecomeProject(solutionId)).to.be.true
        })
        it("Should be able to become a project if all criteria are met with  difrent rating", async function () {
            const problemId = await problems.getProblemCounter()
            await solutions.connect(accounts[1]).proposeSolution(problemId, "Solution 10")
            const solutionId = await solutions.getSolutionCounter()

            for (let i = 2; i < 6; i++) {
                await solutions.connect(accounts[i]).rateSolution(solutionId, 10)
            }
            // for (let i = 2; i < 6; i++) {
            //     await solutions.connect(accounts[i]).rateSolution(solutionId, 10)
            // }

            expect(await solutions.canBecomeProject(solutionId)).to.be.true
        })
        it("Should be able to become a project if all criteria are met with same rating: 10 take 2", async function () {
            const problemId = await problems.getProblemCounter()
            await solutions.connect(accounts[1]).proposeSolution(problemId, "Solution 1547")
            const solutionId = await solutions.getSolutionCounter()

            for (let i = 2; i < 6; i++) {
                await solutions.connect(accounts[i]).rateSolution(solutionId, 10)
            }

            expect(await solutions.canBecomeProject(solutionId)).to.be.true
        })
        it("Should be able to become a project if all criteria are met with same rating: 10", async function () {
            const problemId = await problems.getProblemCounter()
            await solutions.connect(accounts[1]).proposeSolution(problemId, "Solution 8")
            const solutionId = await solutions.getSolutionCounter()

            for (let i = 2; i < 6; i++) {
                await solutions.connect(accounts[i]).rateSolution(solutionId, 10)
            }

            expect(await solutions.canBecomeProject(solutionId)).to.be.true
        })
    })
})
