// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class NewPerformerRemovalOffer extends ethereum.Event {
  get params(): NewPerformerRemovalOffer__Params {
    return new NewPerformerRemovalOffer__Params(this);
  }
}

export class NewPerformerRemovalOffer__Params {
  _event: NewPerformerRemovalOffer;

  constructor(event: NewPerformerRemovalOffer) {
    this._event = event;
  }

  get taskId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get proposer(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class NewTask extends ethereum.Event {
  get params(): NewTask__Params {
    return new NewTask__Params(this);
  }
}

export class NewTask__Params {
  _event: NewTask;

  constructor(event: NewTask) {
    this._event = event;
  }

  get taskId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get projectId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get taskName(): string {
    return this._event.parameters[2].value.toString();
  }

  get taskValue(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class NewTaskOffer extends ethereum.Event {
  get params(): NewTaskOffer__Params {
    return new NewTaskOffer__Params(this);
  }
}

export class NewTaskOffer__Params {
  _event: NewTaskOffer;

  constructor(event: NewTaskOffer) {
    this._event = event;
  }

  get offerId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get taskId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get offeror(): Address {
    return this._event.parameters[2].value.toAddress();
  }
}

export class PerformerRemovalOfferCancelled extends ethereum.Event {
  get params(): PerformerRemovalOfferCancelled__Params {
    return new PerformerRemovalOfferCancelled__Params(this);
  }
}

export class PerformerRemovalOfferCancelled__Params {
  _event: PerformerRemovalOfferCancelled;

  constructor(event: PerformerRemovalOfferCancelled) {
    this._event = event;
  }

  get taskId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }
}

export class PerformerRemovalOfferRated extends ethereum.Event {
  get params(): PerformerRemovalOfferRated__Params {
    return new PerformerRemovalOfferRated__Params(this);
  }
}

export class PerformerRemovalOfferRated__Params {
  _event: PerformerRemovalOfferRated;

  constructor(event: PerformerRemovalOfferRated) {
    this._event = event;
  }

  get taskId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get rater(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get rating(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class TaskAssigned extends ethereum.Event {
  get params(): TaskAssigned__Params {
    return new TaskAssigned__Params(this);
  }
}

export class TaskAssigned__Params {
  _event: TaskAssigned;

  constructor(event: TaskAssigned) {
    this._event = event;
  }

  get taskId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get offerId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get performer(): Address {
    return this._event.parameters[2].value.toAddress();
  }
}

export class TaskCanceled extends ethereum.Event {
  get params(): TaskCanceled__Params {
    return new TaskCanceled__Params(this);
  }
}

export class TaskCanceled__Params {
  _event: TaskCanceled;

  constructor(event: TaskCanceled) {
    this._event = event;
  }

  get taskId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }
}

export class TaskChanged extends ethereum.Event {
  get params(): TaskChanged__Params {
    return new TaskChanged__Params(this);
  }
}

export class TaskChanged__Params {
  _event: TaskChanged;

  constructor(event: TaskChanged) {
    this._event = event;
  }

  get taskId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get newTaskName(): string {
    return this._event.parameters[1].value.toString();
  }

  get newTaskValue(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class TaskCompleted extends ethereum.Event {
  get params(): TaskCompleted__Params {
    return new TaskCompleted__Params(this);
  }
}

export class TaskCompleted__Params {
  _event: TaskCompleted;

  constructor(event: TaskCompleted) {
    this._event = event;
  }

  get taskId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }
}

export class TaskExecutionRated extends ethereum.Event {
  get params(): TaskExecutionRated__Params {
    return new TaskExecutionRated__Params(this);
  }
}

export class TaskExecutionRated__Params {
  _event: TaskExecutionRated;

  constructor(event: TaskExecutionRated) {
    this._event = event;
  }

  get taskId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get rater(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get rating(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class TaskOfferCanceled extends ethereum.Event {
  get params(): TaskOfferCanceled__Params {
    return new TaskOfferCanceled__Params(this);
  }
}

export class TaskOfferCanceled__Params {
  _event: TaskOfferCanceled;

  constructor(event: TaskOfferCanceled) {
    this._event = event;
  }

  get offerId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }
}

export class TaskOfferRated extends ethereum.Event {
  get params(): TaskOfferRated__Params {
    return new TaskOfferRated__Params(this);
  }
}

export class TaskOfferRated__Params {
  _event: TaskOfferRated;

  constructor(event: TaskOfferRated) {
    this._event = event;
  }

  get offerId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get rater(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get rating(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class TaskPerformerResigned extends ethereum.Event {
  get params(): TaskPerformerResigned__Params {
    return new TaskPerformerResigned__Params(this);
  }
}

export class TaskPerformerResigned__Params {
  _event: TaskPerformerResigned;

  constructor(event: TaskPerformerResigned) {
    this._event = event;
  }

  get taskId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }
}

export class TaskPerformerVotedOut extends ethereum.Event {
  get params(): TaskPerformerVotedOut__Params {
    return new TaskPerformerVotedOut__Params(this);
  }
}

export class TaskPerformerVotedOut__Params {
  _event: TaskPerformerVotedOut;

  constructor(event: TaskPerformerVotedOut) {
    this._event = event;
  }

  get taskId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }
}

export class TaskVerified extends ethereum.Event {
  get params(): TaskVerified__Params {
    return new TaskVerified__Params(this);
  }
}

export class TaskVerified__Params {
  _event: TaskVerified;

  constructor(event: TaskVerified) {
    this._event = event;
  }

  get taskId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get areVerified(): boolean {
    return this._event.parameters[1].value.toBoolean();
  }
}

export class Tasks__getTaskDetailsResult {
  value0: BigInt;
  value1: BigInt;
  value2: string;
  value3: BigInt;
  value4: Address;
  value5: BigInt;
  value6: BigInt;
  value7: BigInt;
  value8: i32;
  value9: BigInt;
  value10: boolean;

  constructor(
    value0: BigInt,
    value1: BigInt,
    value2: string,
    value3: BigInt,
    value4: Address,
    value5: BigInt,
    value6: BigInt,
    value7: BigInt,
    value8: i32,
    value9: BigInt,
    value10: boolean
  ) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
    this.value4 = value4;
    this.value5 = value5;
    this.value6 = value6;
    this.value7 = value7;
    this.value8 = value8;
    this.value9 = value9;
    this.value10 = value10;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    map.set("value2", ethereum.Value.fromString(this.value2));
    map.set("value3", ethereum.Value.fromUnsignedBigInt(this.value3));
    map.set("value4", ethereum.Value.fromAddress(this.value4));
    map.set("value5", ethereum.Value.fromUnsignedBigInt(this.value5));
    map.set("value6", ethereum.Value.fromUnsignedBigInt(this.value6));
    map.set("value7", ethereum.Value.fromUnsignedBigInt(this.value7));
    map.set(
      "value8",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(this.value8))
    );
    map.set("value9", ethereum.Value.fromUnsignedBigInt(this.value9));
    map.set("value10", ethereum.Value.fromBoolean(this.value10));
    return map;
  }

  getTaskId(): BigInt {
    return this.value0;
  }

  getProjectId(): BigInt {
    return this.value1;
  }

  getTaskName(): string {
    return this.value2;
  }

  getTaskValue(): BigInt {
    return this.value3;
  }

  getPerformer(): Address {
    return this.value4;
  }

  getCompletionRatingSum(): BigInt {
    return this.value5;
  }

  getNumberOfCompletionRaters(): BigInt {
    return this.value6;
  }

  getAssignedOfferId(): BigInt {
    return this.value7;
  }

  getStatus(): i32 {
    return this.value8;
  }

  getVerificationID(): BigInt {
    return this.value9;
  }

  getIsRemovalProposalActive(): boolean {
    return this.value10;
  }
}

export class Tasks__getTaskOfferDetailsResult {
  value0: BigInt;
  value1: BigInt;
  value2: Address;
  value3: BigInt;
  value4: BigInt;
  value5: boolean;

  constructor(
    value0: BigInt,
    value1: BigInt,
    value2: Address,
    value3: BigInt,
    value4: BigInt,
    value5: boolean
  ) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
    this.value4 = value4;
    this.value5 = value5;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    map.set("value2", ethereum.Value.fromAddress(this.value2));
    map.set("value3", ethereum.Value.fromUnsignedBigInt(this.value3));
    map.set("value4", ethereum.Value.fromUnsignedBigInt(this.value4));
    map.set("value5", ethereum.Value.fromBoolean(this.value5));
    return map;
  }

  getTaskOfferId(): BigInt {
    return this.value0;
  }

  getTaskId(): BigInt {
    return this.value1;
  }

  getOfferor(): Address {
    return this.value2;
  }

  getRatingSum(): BigInt {
    return this.value3;
  }

  getNumberOfRaters(): BigInt {
    return this.value4;
  }

  getIsActive(): boolean {
    return this.value5;
  }
}

export class Tasks extends ethereum.SmartContract {
  static bind(address: Address): Tasks {
    return new Tasks("Tasks", address);
  }

  doesTaskNameExist(_projectId: BigInt, _taskName: string): boolean {
    let result = super.call(
      "doesTaskNameExist",
      "doesTaskNameExist(uint256,string):(bool)",
      [
        ethereum.Value.fromUnsignedBigInt(_projectId),
        ethereum.Value.fromString(_taskName)
      ]
    );

    return result[0].toBoolean();
  }

  try_doesTaskNameExist(
    _projectId: BigInt,
    _taskName: string
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "doesTaskNameExist",
      "doesTaskNameExist(uint256,string):(bool)",
      [
        ethereum.Value.fromUnsignedBigInt(_projectId),
        ethereum.Value.fromString(_taskName)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  getMinTaskValue(): BigInt {
    let result = super.call(
      "getMinTaskValue",
      "getMinTaskValue():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_getMinTaskValue(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getMinTaskValue",
      "getMinTaskValue():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getTaskDetails(_taskId: BigInt): Tasks__getTaskDetailsResult {
    let result = super.call(
      "getTaskDetails",
      "getTaskDetails(uint256):(uint256,uint256,string,uint256,address,uint256,uint256,uint256,uint8,uint256,bool)",
      [ethereum.Value.fromUnsignedBigInt(_taskId)]
    );

    return new Tasks__getTaskDetailsResult(
      result[0].toBigInt(),
      result[1].toBigInt(),
      result[2].toString(),
      result[3].toBigInt(),
      result[4].toAddress(),
      result[5].toBigInt(),
      result[6].toBigInt(),
      result[7].toBigInt(),
      result[8].toI32(),
      result[9].toBigInt(),
      result[10].toBoolean()
    );
  }

  try_getTaskDetails(
    _taskId: BigInt
  ): ethereum.CallResult<Tasks__getTaskDetailsResult> {
    let result = super.tryCall(
      "getTaskDetails",
      "getTaskDetails(uint256):(uint256,uint256,string,uint256,address,uint256,uint256,uint256,uint8,uint256,bool)",
      [ethereum.Value.fromUnsignedBigInt(_taskId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new Tasks__getTaskDetailsResult(
        value[0].toBigInt(),
        value[1].toBigInt(),
        value[2].toString(),
        value[3].toBigInt(),
        value[4].toAddress(),
        value[5].toBigInt(),
        value[6].toBigInt(),
        value[7].toBigInt(),
        value[8].toI32(),
        value[9].toBigInt(),
        value[10].toBoolean()
      )
    );
  }

  getTaskOfferDetails(_taskOfferId: BigInt): Tasks__getTaskOfferDetailsResult {
    let result = super.call(
      "getTaskOfferDetails",
      "getTaskOfferDetails(uint256):(uint256,uint256,address,uint256,uint256,bool)",
      [ethereum.Value.fromUnsignedBigInt(_taskOfferId)]
    );

    return new Tasks__getTaskOfferDetailsResult(
      result[0].toBigInt(),
      result[1].toBigInt(),
      result[2].toAddress(),
      result[3].toBigInt(),
      result[4].toBigInt(),
      result[5].toBoolean()
    );
  }

  try_getTaskOfferDetails(
    _taskOfferId: BigInt
  ): ethereum.CallResult<Tasks__getTaskOfferDetailsResult> {
    let result = super.tryCall(
      "getTaskOfferDetails",
      "getTaskOfferDetails(uint256):(uint256,uint256,address,uint256,uint256,bool)",
      [ethereum.Value.fromUnsignedBigInt(_taskOfferId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new Tasks__getTaskOfferDetailsResult(
        value[0].toBigInt(),
        value[1].toBigInt(),
        value[2].toAddress(),
        value[3].toBigInt(),
        value[4].toBigInt(),
        value[5].toBoolean()
      )
    );
  }

  getTaskOfferId(_taskId: BigInt): BigInt {
    let result = super.call(
      "getTaskOfferId",
      "getTaskOfferId(uint256):(uint256)",
      [ethereum.Value.fromUnsignedBigInt(_taskId)]
    );

    return result[0].toBigInt();
  }

  try_getTaskOfferId(_taskId: BigInt): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getTaskOfferId",
      "getTaskOfferId(uint256):(uint256)",
      [ethereum.Value.fromUnsignedBigInt(_taskId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getTaskOffers(_taskId: BigInt): Array<BigInt> {
    let result = super.call(
      "getTaskOffers",
      "getTaskOffers(uint256):(uint256[])",
      [ethereum.Value.fromUnsignedBigInt(_taskId)]
    );

    return result[0].toBigIntArray();
  }

  try_getTaskOffers(_taskId: BigInt): ethereum.CallResult<Array<BigInt>> {
    let result = super.tryCall(
      "getTaskOffers",
      "getTaskOffers(uint256):(uint256[])",
      [ethereum.Value.fromUnsignedBigInt(_taskId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigIntArray());
  }

  getTotalTaskOffers(): BigInt {
    let result = super.call(
      "getTotalTaskOffers",
      "getTotalTaskOffers():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_getTotalTaskOffers(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getTotalTaskOffers",
      "getTotalTaskOffers():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getTotalTasks(): BigInt {
    let result = super.call("getTotalTasks", "getTotalTasks():(uint256)", []);

    return result[0].toBigInt();
  }

  try_getTotalTasks(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getTotalTasks",
      "getTotalTasks():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getVerificationIDCounter(): BigInt {
    let result = super.call(
      "getVerificationIDCounter",
      "getVerificationIDCounter():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_getVerificationIDCounter(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getVerificationIDCounter",
      "getVerificationIDCounter():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  hasAddressProposed(_taskId: BigInt, _address: Address): boolean {
    let result = super.call(
      "hasAddressProposed",
      "hasAddressProposed(uint256,address):(bool)",
      [
        ethereum.Value.fromUnsignedBigInt(_taskId),
        ethereum.Value.fromAddress(_address)
      ]
    );

    return result[0].toBoolean();
  }

  try_hasAddressProposed(
    _taskId: BigInt,
    _address: Address
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "hasAddressProposed",
      "hasAddressProposed(uint256,address):(bool)",
      [
        ethereum.Value.fromUnsignedBigInt(_taskId),
        ethereum.Value.fromAddress(_address)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  isAddressRaterInTaskOffer(_taskOfferId: BigInt, _address: Address): boolean {
    let result = super.call(
      "isAddressRaterInTaskOffer",
      "isAddressRaterInTaskOffer(uint256,address):(bool)",
      [
        ethereum.Value.fromUnsignedBigInt(_taskOfferId),
        ethereum.Value.fromAddress(_address)
      ]
    );

    return result[0].toBoolean();
  }

  try_isAddressRaterInTaskOffer(
    _taskOfferId: BigInt,
    _address: Address
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "isAddressRaterInTaskOffer",
      "isAddressRaterInTaskOffer(uint256,address):(bool)",
      [
        ethereum.Value.fromUnsignedBigInt(_taskOfferId),
        ethereum.Value.fromAddress(_address)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  isAddressVerificationRaterInTask(
    _taskId: BigInt,
    _address: Address
  ): boolean {
    let result = super.call(
      "isAddressVerificationRaterInTask",
      "isAddressVerificationRaterInTask(uint256,address):(bool)",
      [
        ethereum.Value.fromUnsignedBigInt(_taskId),
        ethereum.Value.fromAddress(_address)
      ]
    );

    return result[0].toBoolean();
  }

  try_isAddressVerificationRaterInTask(
    _taskId: BigInt,
    _address: Address
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "isAddressVerificationRaterInTask",
      "isAddressVerificationRaterInTask(uint256,address):(bool)",
      [
        ethereum.Value.fromUnsignedBigInt(_taskId),
        ethereum.Value.fromAddress(_address)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get _membershipContract(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _projectsContract(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _tokenManagementContract(): Address {
    return this._call.inputValues[2].value.toAddress();
  }

  get _authorizationManagementContract(): Address {
    return this._call.inputValues[3].value.toAddress();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class AddTaskCall extends ethereum.Call {
  get inputs(): AddTaskCall__Inputs {
    return new AddTaskCall__Inputs(this);
  }

  get outputs(): AddTaskCall__Outputs {
    return new AddTaskCall__Outputs(this);
  }
}

export class AddTaskCall__Inputs {
  _call: AddTaskCall;

  constructor(call: AddTaskCall) {
    this._call = call;
  }

  get _projectId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _taskName(): string {
    return this._call.inputValues[1].value.toString();
  }

  get _taskValue(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class AddTaskCall__Outputs {
  _call: AddTaskCall;

  constructor(call: AddTaskCall) {
    this._call = call;
  }
}

export class AssignTaskCall extends ethereum.Call {
  get inputs(): AssignTaskCall__Inputs {
    return new AssignTaskCall__Inputs(this);
  }

  get outputs(): AssignTaskCall__Outputs {
    return new AssignTaskCall__Outputs(this);
  }
}

export class AssignTaskCall__Inputs {
  _call: AssignTaskCall;

  constructor(call: AssignTaskCall) {
    this._call = call;
  }

  get _taskId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class AssignTaskCall__Outputs {
  _call: AssignTaskCall;

  constructor(call: AssignTaskCall) {
    this._call = call;
  }
}

export class CancelPerformerRemovalOfferCall extends ethereum.Call {
  get inputs(): CancelPerformerRemovalOfferCall__Inputs {
    return new CancelPerformerRemovalOfferCall__Inputs(this);
  }

  get outputs(): CancelPerformerRemovalOfferCall__Outputs {
    return new CancelPerformerRemovalOfferCall__Outputs(this);
  }
}

export class CancelPerformerRemovalOfferCall__Inputs {
  _call: CancelPerformerRemovalOfferCall;

  constructor(call: CancelPerformerRemovalOfferCall) {
    this._call = call;
  }

  get _taskId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class CancelPerformerRemovalOfferCall__Outputs {
  _call: CancelPerformerRemovalOfferCall;

  constructor(call: CancelPerformerRemovalOfferCall) {
    this._call = call;
  }
}

export class CancelTaskCall extends ethereum.Call {
  get inputs(): CancelTaskCall__Inputs {
    return new CancelTaskCall__Inputs(this);
  }

  get outputs(): CancelTaskCall__Outputs {
    return new CancelTaskCall__Outputs(this);
  }
}

export class CancelTaskCall__Inputs {
  _call: CancelTaskCall;

  constructor(call: CancelTaskCall) {
    this._call = call;
  }

  get _taskId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class CancelTaskCall__Outputs {
  _call: CancelTaskCall;

  constructor(call: CancelTaskCall) {
    this._call = call;
  }
}

export class CancelTaskOfferCall extends ethereum.Call {
  get inputs(): CancelTaskOfferCall__Inputs {
    return new CancelTaskOfferCall__Inputs(this);
  }

  get outputs(): CancelTaskOfferCall__Outputs {
    return new CancelTaskOfferCall__Outputs(this);
  }
}

export class CancelTaskOfferCall__Inputs {
  _call: CancelTaskOfferCall;

  constructor(call: CancelTaskOfferCall) {
    this._call = call;
  }

  get _offerId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class CancelTaskOfferCall__Outputs {
  _call: CancelTaskOfferCall;

  constructor(call: CancelTaskOfferCall) {
    this._call = call;
  }
}

export class ChangeTaskCall extends ethereum.Call {
  get inputs(): ChangeTaskCall__Inputs {
    return new ChangeTaskCall__Inputs(this);
  }

  get outputs(): ChangeTaskCall__Outputs {
    return new ChangeTaskCall__Outputs(this);
  }
}

export class ChangeTaskCall__Inputs {
  _call: ChangeTaskCall;

  constructor(call: ChangeTaskCall) {
    this._call = call;
  }

  get _taskId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _newTaskName(): string {
    return this._call.inputValues[1].value.toString();
  }

  get _newTaskValue(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class ChangeTaskCall__Outputs {
  _call: ChangeTaskCall;

  constructor(call: ChangeTaskCall) {
    this._call = call;
  }
}

export class CheckPerformerRemovalOfferRatingsCall extends ethereum.Call {
  get inputs(): CheckPerformerRemovalOfferRatingsCall__Inputs {
    return new CheckPerformerRemovalOfferRatingsCall__Inputs(this);
  }

  get outputs(): CheckPerformerRemovalOfferRatingsCall__Outputs {
    return new CheckPerformerRemovalOfferRatingsCall__Outputs(this);
  }
}

export class CheckPerformerRemovalOfferRatingsCall__Inputs {
  _call: CheckPerformerRemovalOfferRatingsCall;

  constructor(call: CheckPerformerRemovalOfferRatingsCall) {
    this._call = call;
  }

  get _taskId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class CheckPerformerRemovalOfferRatingsCall__Outputs {
  _call: CheckPerformerRemovalOfferRatingsCall;

  constructor(call: CheckPerformerRemovalOfferRatingsCall) {
    this._call = call;
  }
}

export class CompleteTaskCall extends ethereum.Call {
  get inputs(): CompleteTaskCall__Inputs {
    return new CompleteTaskCall__Inputs(this);
  }

  get outputs(): CompleteTaskCall__Outputs {
    return new CompleteTaskCall__Outputs(this);
  }
}

export class CompleteTaskCall__Inputs {
  _call: CompleteTaskCall;

  constructor(call: CompleteTaskCall) {
    this._call = call;
  }

  get _taskId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class CompleteTaskCall__Outputs {
  _call: CompleteTaskCall;

  constructor(call: CompleteTaskCall) {
    this._call = call;
  }
}

export class ProposeTaskOfferCall extends ethereum.Call {
  get inputs(): ProposeTaskOfferCall__Inputs {
    return new ProposeTaskOfferCall__Inputs(this);
  }

  get outputs(): ProposeTaskOfferCall__Outputs {
    return new ProposeTaskOfferCall__Outputs(this);
  }
}

export class ProposeTaskOfferCall__Inputs {
  _call: ProposeTaskOfferCall;

  constructor(call: ProposeTaskOfferCall) {
    this._call = call;
  }

  get _taskId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class ProposeTaskOfferCall__Outputs {
  _call: ProposeTaskOfferCall;

  constructor(call: ProposeTaskOfferCall) {
    this._call = call;
  }
}

export class ProposerRemovePerformerOfferCall extends ethereum.Call {
  get inputs(): ProposerRemovePerformerOfferCall__Inputs {
    return new ProposerRemovePerformerOfferCall__Inputs(this);
  }

  get outputs(): ProposerRemovePerformerOfferCall__Outputs {
    return new ProposerRemovePerformerOfferCall__Outputs(this);
  }
}

export class ProposerRemovePerformerOfferCall__Inputs {
  _call: ProposerRemovePerformerOfferCall;

  constructor(call: ProposerRemovePerformerOfferCall) {
    this._call = call;
  }

  get _taskId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class ProposerRemovePerformerOfferCall__Outputs {
  _call: ProposerRemovePerformerOfferCall;

  constructor(call: ProposerRemovePerformerOfferCall) {
    this._call = call;
  }
}

export class RateCompletedTaskCall extends ethereum.Call {
  get inputs(): RateCompletedTaskCall__Inputs {
    return new RateCompletedTaskCall__Inputs(this);
  }

  get outputs(): RateCompletedTaskCall__Outputs {
    return new RateCompletedTaskCall__Outputs(this);
  }
}

export class RateCompletedTaskCall__Inputs {
  _call: RateCompletedTaskCall;

  constructor(call: RateCompletedTaskCall) {
    this._call = call;
  }

  get _taskId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _rating(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class RateCompletedTaskCall__Outputs {
  _call: RateCompletedTaskCall;

  constructor(call: RateCompletedTaskCall) {
    this._call = call;
  }
}

export class RatePerformerRemovalOfferCall extends ethereum.Call {
  get inputs(): RatePerformerRemovalOfferCall__Inputs {
    return new RatePerformerRemovalOfferCall__Inputs(this);
  }

  get outputs(): RatePerformerRemovalOfferCall__Outputs {
    return new RatePerformerRemovalOfferCall__Outputs(this);
  }
}

export class RatePerformerRemovalOfferCall__Inputs {
  _call: RatePerformerRemovalOfferCall;

  constructor(call: RatePerformerRemovalOfferCall) {
    this._call = call;
  }

  get _taskId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _rating(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class RatePerformerRemovalOfferCall__Outputs {
  _call: RatePerformerRemovalOfferCall;

  constructor(call: RatePerformerRemovalOfferCall) {
    this._call = call;
  }
}

export class RateTaskOfferCall extends ethereum.Call {
  get inputs(): RateTaskOfferCall__Inputs {
    return new RateTaskOfferCall__Inputs(this);
  }

  get outputs(): RateTaskOfferCall__Outputs {
    return new RateTaskOfferCall__Outputs(this);
  }
}

export class RateTaskOfferCall__Inputs {
  _call: RateTaskOfferCall;

  constructor(call: RateTaskOfferCall) {
    this._call = call;
  }

  get _offerId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _rating(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class RateTaskOfferCall__Outputs {
  _call: RateTaskOfferCall;

  constructor(call: RateTaskOfferCall) {
    this._call = call;
  }
}

export class TaskPerformerResignCall extends ethereum.Call {
  get inputs(): TaskPerformerResignCall__Inputs {
    return new TaskPerformerResignCall__Inputs(this);
  }

  get outputs(): TaskPerformerResignCall__Outputs {
    return new TaskPerformerResignCall__Outputs(this);
  }
}

export class TaskPerformerResignCall__Inputs {
  _call: TaskPerformerResignCall;

  constructor(call: TaskPerformerResignCall) {
    this._call = call;
  }

  get _taskId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class TaskPerformerResignCall__Outputs {
  _call: TaskPerformerResignCall;

  constructor(call: TaskPerformerResignCall) {
    this._call = call;
  }
}

export class VerifyTaskCall extends ethereum.Call {
  get inputs(): VerifyTaskCall__Inputs {
    return new VerifyTaskCall__Inputs(this);
  }

  get outputs(): VerifyTaskCall__Outputs {
    return new VerifyTaskCall__Outputs(this);
  }
}

export class VerifyTaskCall__Inputs {
  _call: VerifyTaskCall;

  constructor(call: VerifyTaskCall) {
    this._call = call;
  }

  get _taskId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class VerifyTaskCall__Outputs {
  _call: VerifyTaskCall;

  constructor(call: VerifyTaskCall) {
    this._call = call;
  }
}