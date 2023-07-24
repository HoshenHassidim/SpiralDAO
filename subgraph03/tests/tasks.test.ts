import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { NewTask } from "../generated/schema"
import { NewTask as NewTaskEvent } from "../generated/Tasks/Tasks"
import { handleNewTask } from "../src/tasks"
import { createNewTaskEvent } from "./tasks-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let taskId = BigInt.fromI32(234)
    let projectId = BigInt.fromI32(234)
    let taskName = "Example string value"
    let taskValue = BigInt.fromI32(234)
    let newNewTaskEvent = createNewTaskEvent(
      taskId,
      projectId,
      taskName,
      taskValue
    )
    handleNewTask(newNewTaskEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("NewTask created and stored", () => {
    assert.entityCount("NewTask", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "NewTask",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "taskId",
      "234"
    )
    assert.fieldEquals(
      "NewTask",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "projectId",
      "234"
    )
    assert.fieldEquals(
      "NewTask",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "taskName",
      "Example string value"
    )
    assert.fieldEquals(
      "NewTask",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "taskValue",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
