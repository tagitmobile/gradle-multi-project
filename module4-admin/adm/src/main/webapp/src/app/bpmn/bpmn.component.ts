import { AfterViewInit, Component } from '@angular/core';
import BpmnViewer from 'bpmn-js';

@Component({
    selector: 'mx-ac-bpmn',
    templateUrl: './bpmn.component.html',
    styleUrls: ['./bpmn.component.scss'],
    standalone: false
})
export class BpmnComponent implements AfterViewInit {

  viewer: any;

  diagram: string;
  diagram1: string;
  width: number = 90;
  dragPosition = {x: 0, y: 0};
  constructor() {
    this.diagram = `<?xml version="1.0" encoding="UTF-8"?>
    <bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:bioc="http://bpmn.io/schema/bpmn/biocolor/1.0" xmlns:modeler="http://camunda.org/schema/modeler/1.0" id="Definitions_179ckon" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="4.8.1" modeler:executionPlatform="Camunda Platform" modeler:executionPlatformVersion="7.15.0">
      <bpmn:process id="MobeixDigitalOrigination" name="Mobeix Digital Origination" isExecutable="true" camunda:versionTag="7.0">
        <bpmn:startEvent id="StartEvent_Origination" name="Start with Mobile Number">
          <bpmn:extensionElements>
            <camunda:formData businessKey="businessKey">
              <camunda:formField id="mobileNumber" label="Enter your mobile number" type="string">
                <camunda:validation>
                  <camunda:constraint name="required" config="true" />
                </camunda:validation>
              </camunda:formField>
              <camunda:formField id="otpValid" label="Valid OTP" type="boolean" defaultValue="true" />
              <camunda:formField id="businessKey" label="Business Key" type="string" />
            </camunda:formData>
          </bpmn:extensionElements>
          <bpmn:outgoing>Flow_06v8nmt</bpmn:outgoing>
        </bpmn:startEvent>
        <bpmn:userTask id="Activity_ProductSelection" name="Product selection">
          <bpmn:extensionElements>
            <camunda:formData>
              <camunda:formField id="productCode" label="Product Code" type="string" defaultValue="easyAccess" />
            </camunda:formData>
            <camunda:inputOutput>
              <camunda:inputParameter name="mobeixAction">ONPDLST</camunda:inputParameter>
            </camunda:inputOutput>
          </bpmn:extensionElements>
          <bpmn:incoming>Flow_1czmu9d</bpmn:incoming>
          <bpmn:incoming>Flow_0pw8zra</bpmn:incoming>
          <bpmn:incoming>Flow_1fb8gkx</bpmn:incoming>
          <bpmn:outgoing>Flow_162yrkt</bpmn:outgoing>
        </bpmn:userTask>
        <bpmn:sequenceFlow id="Flow_162yrkt" name="productCode" sourceRef="Activity_ProductSelection" targetRef="Activity_ProductTypeDecision" />
        <bpmn:businessRuleTask id="Activity_ProductTypeDecision" name="Decide product type" camunda:resultVariable="productType" camunda:decisionRef="RetailOnboardingSubProcess" camunda:mapDecisionResult="singleResult">
          <bpmn:incoming>Flow_162yrkt</bpmn:incoming>
          <bpmn:outgoing>Flow_1ye40rr</bpmn:outgoing>
        </bpmn:businessRuleTask>
        <bpmn:exclusiveGateway id="Gateway_ProductType" name="Product Type">
          <bpmn:incoming>Flow_1ye40rr</bpmn:incoming>
          <bpmn:outgoing>Flow_Casa</bpmn:outgoing>
          <bpmn:outgoing>Flow_Loan</bpmn:outgoing>
        </bpmn:exclusiveGateway>
        <bpmn:sequenceFlow id="Flow_1ye40rr" sourceRef="Activity_ProductTypeDecision" targetRef="Gateway_ProductType" />
        <bpmn:sequenceFlow id="Flow_Casa" name="CASA" sourceRef="Gateway_ProductType" targetRef="callCasaProcess">
          <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">productType == 'CASA'</bpmn:conditionExpression>
        </bpmn:sequenceFlow>
        <bpmn:sequenceFlow id="Flow_Loan" name="LOAN" sourceRef="Gateway_ProductType" targetRef="callLoanProcess">
          <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">productType == 'LOAN'</bpmn:conditionExpression>
        </bpmn:sequenceFlow>
        <bpmn:callActivity id="callCasaProcess" name="Saving Account On-boarding" calledElement="CasaOrigination">
          <bpmn:extensionElements>
            <camunda:in businessKey="#{execution.processBusinessKey}" />
            <camunda:in variables="all" />
            <camunda:out variables="all" />
          </bpmn:extensionElements>
          <bpmn:incoming>Flow_Casa</bpmn:incoming>
          <bpmn:outgoing>Flow_1irtk8d</bpmn:outgoing>
        </bpmn:callActivity>
        <bpmn:callActivity id="callLoanProcess" name="Loan Account On-boarding" calledElement="LoanOrigination">
          <bpmn:extensionElements>
            <camunda:in businessKey="#{execution.processBusinessKey}" />
            <camunda:properties>
              <camunda:property name="in" value="all" />
              <camunda:property name="out" value="all" />
            </camunda:properties>
            <camunda:in variables="all" />
            <camunda:out variables="all" />
          </bpmn:extensionElements>
          <bpmn:incoming>Flow_Loan</bpmn:incoming>
          <bpmn:outgoing>Flow_0e9k4m2</bpmn:outgoing>
        </bpmn:callActivity>
        <bpmn:userTask id="Activity_ChannelRegistration" name="Create MRB channel credentials">
          <bpmn:extensionElements>
            <camunda:formData>
              <camunda:formField id="userId" label="User ID" type="string" defaultValue="john" />
              <camunda:formField id="password" label="Password" type="string" defaultValue="tagit123" />
            </camunda:formData>
            <camunda:inputOutput>
              <camunda:inputParameter name="mobeixAction">2000</camunda:inputParameter>
            </camunda:inputOutput>
          </bpmn:extensionElements>
          <bpmn:incoming>Flow_0kzkzdc</bpmn:incoming>
          <bpmn:outgoing>Flow_1jrvhe6</bpmn:outgoing>
        </bpmn:userTask>
        <bpmn:exclusiveGateway id="Gateway_ChannelRegistration" name="New user?" default="Flow_0kzkzdc">
          <bpmn:incoming>Flow_0qsjrz2</bpmn:incoming>
          <bpmn:outgoing>Flow_0kzkzdc</bpmn:outgoing>
          <bpmn:outgoing>Flow_1mxythp</bpmn:outgoing>
        </bpmn:exclusiveGateway>
        <bpmn:sequenceFlow id="Flow_0kzkzdc" name="Yes" sourceRef="Gateway_ChannelRegistration" targetRef="Activity_ChannelRegistration" />
        <bpmn:sequenceFlow id="Flow_0e9k4m2" sourceRef="callLoanProcess" targetRef="Gateway_OriginationSuccess" />
        <bpmn:endEvent id="Event_CompleteExistingUser" name="Existing user">
          <bpmn:extensionElements>
            <camunda:inputOutput>
              <camunda:inputParameter name="mobeixAction">1810</camunda:inputParameter>
            </camunda:inputOutput>
          </bpmn:extensionElements>
          <bpmn:incoming>Flow_1mxythp</bpmn:incoming>
        </bpmn:endEvent>
        <bpmn:sequenceFlow id="Flow_1mxythp" name="No" sourceRef="Gateway_ChannelRegistration" targetRef="Event_CompleteExistingUser">
          <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">isNewUser == false</bpmn:conditionExpression>
        </bpmn:sequenceFlow>
        <bpmn:exclusiveGateway id="Gateway_OriginationSuccess" name="Successful?" default="Flow_0t29msk">
          <bpmn:incoming>Flow_1irtk8d</bpmn:incoming>
          <bpmn:incoming>Flow_0e9k4m2</bpmn:incoming>
          <bpmn:outgoing>Flow_0hwxzkm</bpmn:outgoing>
          <bpmn:outgoing>Flow_0t29msk</bpmn:outgoing>
        </bpmn:exclusiveGateway>
        <bpmn:sequenceFlow id="Flow_1irtk8d" sourceRef="callCasaProcess" targetRef="Gateway_OriginationSuccess" />
        <bpmn:sequenceFlow id="Flow_0hwxzkm" name="Yes" sourceRef="Gateway_OriginationSuccess" targetRef="Activity_OriginationSuccess">
          <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">finalApproval == 'pass'</bpmn:conditionExpression>
        </bpmn:sequenceFlow>
        <bpmn:sequenceFlow id="Flow_0t29msk" name="No" sourceRef="Gateway_OriginationSuccess" targetRef="Activity_OriginationFailed" />
        <bpmn:sequenceFlow id="Flow_0qsjrz2" sourceRef="Activity_OriginationSuccess" targetRef="Gateway_ChannelRegistration" />
        <bpmn:userTask id="Activity_OriginationSuccess" name="Display success page">
          <bpmn:extensionElements>
            <camunda:inputOutput>
              <camunda:inputParameter name="mobeixAction">1800</camunda:inputParameter>
            </camunda:inputOutput>
          </bpmn:extensionElements>
          <bpmn:incoming>Flow_0hwxzkm</bpmn:incoming>
          <bpmn:outgoing>Flow_0qsjrz2</bpmn:outgoing>
        </bpmn:userTask>
        <bpmn:userTask id="Activity_OriginationFailed" name="Display failure page">
          <bpmn:extensionElements>
            <camunda:formData>
              <camunda:formField id="reapply" label="Do you want to re-apply?" type="boolean" defaultValue="false" />
            </camunda:formData>
            <camunda:inputOutput>
              <camunda:inputParameter name="mobeixAction">1900</camunda:inputParameter>
            </camunda:inputOutput>
          </bpmn:extensionElements>
          <bpmn:incoming>Flow_0t29msk</bpmn:incoming>
          <bpmn:outgoing>Flow_0zbaroh</bpmn:outgoing>
        </bpmn:userTask>
        <bpmn:exclusiveGateway id="Gateway_Reapply" name="Re-apply?" default="Flow_133ay4i">
          <bpmn:incoming>Flow_0zbaroh</bpmn:incoming>
          <bpmn:outgoing>Flow_133ay4i</bpmn:outgoing>
          <bpmn:outgoing>Flow_1czmu9d</bpmn:outgoing>
        </bpmn:exclusiveGateway>
        <bpmn:sequenceFlow id="Flow_0zbaroh" sourceRef="Activity_OriginationFailed" targetRef="Gateway_Reapply" />
        <bpmn:endEvent id="Event_NoReapply" name="User does not re-apply">
          <bpmn:incoming>Flow_133ay4i</bpmn:incoming>
        </bpmn:endEvent>
        <bpmn:sequenceFlow id="Flow_133ay4i" name="No" sourceRef="Gateway_Reapply" targetRef="Event_NoReapply" />
        <bpmn:sequenceFlow id="Flow_1czmu9d" name="Yes" sourceRef="Gateway_Reapply" targetRef="Activity_ProductSelection">
          <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">reapply == true</bpmn:conditionExpression>
        </bpmn:sequenceFlow>
        <bpmn:endEvent id="Event_CompleteNewUser" name="Channel registration completed">
          <bpmn:incoming>Flow_1jrvhe6</bpmn:incoming>
        </bpmn:endEvent>
        <bpmn:sequenceFlow id="Flow_1jrvhe6" sourceRef="Activity_ChannelRegistration" targetRef="Event_CompleteNewUser" />
        <bpmn:serviceTask id="Activity_CifCheck" name="Look-up Customer ID via Mobile Number" camunda:expression="${true}" camunda:resultVariable="isNewCustomer">
          <bpmn:extensionElements>
            <camunda:inputOutput>
              <camunda:outputParameter name="cifNo" />
            </camunda:inputOutput>
          </bpmn:extensionElements>
          <bpmn:incoming>Flow_MobileNoValid</bpmn:incoming>
          <bpmn:outgoing>Flow_17ld8eh</bpmn:outgoing>
        </bpmn:serviceTask>
        <bpmn:exclusiveGateway id="Gateway_NewCustomer" name="New customer?" default="Flow_NewCustomer">
          <bpmn:incoming>Flow_17ld8eh</bpmn:incoming>
          <bpmn:outgoing>Flow_NewCustomer</bpmn:outgoing>
          <bpmn:outgoing>Flow_ExistingCustomer</bpmn:outgoing>
        </bpmn:exclusiveGateway>
        <bpmn:sequenceFlow id="Flow_17ld8eh" sourceRef="Activity_CifCheck" targetRef="Gateway_NewCustomer" />
        <bpmn:sequenceFlow id="Flow_NewCustomer" name="Yes" sourceRef="Gateway_NewCustomer" targetRef="Activity_OriginationEligibility" />
        <bpmn:sequenceFlow id="Flow_ExistingCustomer" name="No" sourceRef="Gateway_NewCustomer" targetRef="Activity_WelcomeExistingCustomer">
          <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">isNewCustomer == false</bpmn:conditionExpression>
        </bpmn:sequenceFlow>
        <bpmn:userTask id="Activity_WelcomeExistingCustomer" name="Display welcome back page">
          <bpmn:extensionElements>
            <camunda:inputOutput>
              <camunda:inputParameter name="mobeixAction">1110</camunda:inputParameter>
            </camunda:inputOutput>
          </bpmn:extensionElements>
          <bpmn:incoming>Flow_ExistingCustomer</bpmn:incoming>
          <bpmn:outgoing>Flow_0pw8zra</bpmn:outgoing>
        </bpmn:userTask>
        <bpmn:userTask id="Activity_WelcomeNewCustomer" name="Display welcome page">
          <bpmn:extensionElements>
            <camunda:inputOutput>
              <camunda:inputParameter name="mobeixAction">1100</camunda:inputParameter>
            </camunda:inputOutput>
          </bpmn:extensionElements>
          <bpmn:incoming>Flow_14u5ml8</bpmn:incoming>
          <bpmn:outgoing>Flow_1fb8gkx</bpmn:outgoing>
        </bpmn:userTask>
        <bpmn:endEvent id="Event_Cancelled" name="User cancelled">
          <bpmn:extensionElements>
            <camunda:inputOutput>
              <camunda:inputParameter name="mobeixAction">1000</camunda:inputParameter>
            </camunda:inputOutput>
          </bpmn:extensionElements>
          <bpmn:incoming>Flow_Cancelled</bpmn:incoming>
        </bpmn:endEvent>
        <bpmn:endEvent id="Event_13545yc" name="Mobile number is not authenticated">
          <bpmn:extensionElements>
            <camunda:inputOutput>
              <camunda:inputParameter name="mobeixAction">1005</camunda:inputParameter>
            </camunda:inputOutput>
          </bpmn:extensionElements>
          <bpmn:incoming>Flow_MobileNoOtpFailed</bpmn:incoming>
        </bpmn:endEvent>
        <bpmn:exclusiveGateway id="Gateway_OtpFailed" name="Is authenticated?" default="Flow_Cancelled">
          <bpmn:incoming>Flow_MobileNoInvalid</bpmn:incoming>
          <bpmn:outgoing>Flow_MobileNoOtpFailed</bpmn:outgoing>
          <bpmn:outgoing>Flow_Cancelled</bpmn:outgoing>
        </bpmn:exclusiveGateway>
        <bpmn:sequenceFlow id="Flow_MobileNoOtpFailed" name="No" sourceRef="Gateway_OtpFailed" targetRef="Event_13545yc">
          <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">otpValid == false</bpmn:conditionExpression>
        </bpmn:sequenceFlow>
        <bpmn:sequenceFlow id="Flow_Cancelled" sourceRef="Gateway_OtpFailed" targetRef="Event_Cancelled" />
        <bpmn:exclusiveGateway id="Gateway_MobileNoCheck" name="Mobile number is available and authenticated?" default="Flow_MobileNoInvalid">
          <bpmn:incoming>Flow_06v8nmt</bpmn:incoming>
          <bpmn:outgoing>Flow_MobileNoInvalid</bpmn:outgoing>
          <bpmn:outgoing>Flow_MobileNoValid</bpmn:outgoing>
        </bpmn:exclusiveGateway>
        <bpmn:sequenceFlow id="Flow_MobileNoInvalid" name="No" sourceRef="Gateway_MobileNoCheck" targetRef="Gateway_OtpFailed" />
        <bpmn:sequenceFlow id="Flow_MobileNoValid" name="Yes" sourceRef="Gateway_MobileNoCheck" targetRef="Activity_CifCheck">
          <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">mobileNumber != null && otpValid == true}</bpmn:conditionExpression>
        </bpmn:sequenceFlow>
        <bpmn:sequenceFlow id="Flow_06v8nmt" sourceRef="StartEvent_Origination" targetRef="Gateway_MobileNoCheck" />
        <bpmn:userTask id="Activity_OriginationEligibility" name="Check eligibility">
          <bpmn:extensionElements>
            <camunda:formData>
              <camunda:formField id="exposed" label="Are you politically exposed person? " type="boolean">
                <camunda:properties>
                  <camunda:property id="TRANSLATION_CODE" value="ELIGIBLE_LABEL_POLITICAL" />
                </camunda:properties>
              </camunda:formField>
              <camunda:formField id="existingClient" label="Are you an existing client?" type="boolean" />
              <camunda:formField id="nonResident" label="Are you a non-resident?" type="boolean" />
            </camunda:formData>
            <camunda:inputOutput>
              <camunda:inputParameter name="mobeixAction">CASAEL</camunda:inputParameter>
            </camunda:inputOutput>
          </bpmn:extensionElements>
          <bpmn:incoming>Flow_NewCustomer</bpmn:incoming>
          <bpmn:outgoing>Flow_14sdyy3</bpmn:outgoing>
        </bpmn:userTask>
        <bpmn:businessRuleTask id="Activity_OriginationEligibilityDecision" name="Decide eligibility" camunda:resultVariable="eligible" camunda:decisionRef="RetailOnboardingCasaEligibility" camunda:mapDecisionResult="singleEntry">
          <bpmn:incoming>Flow_14sdyy3</bpmn:incoming>
          <bpmn:outgoing>Flow_1mfpp21</bpmn:outgoing>
        </bpmn:businessRuleTask>
        <bpmn:sequenceFlow id="Flow_0pw8zra" sourceRef="Activity_WelcomeExistingCustomer" targetRef="Activity_ProductSelection" />
        <bpmn:sequenceFlow id="Flow_14sdyy3" sourceRef="Activity_OriginationEligibility" targetRef="Activity_OriginationEligibilityDecision" />
        <bpmn:sequenceFlow id="Flow_1fb8gkx" sourceRef="Activity_WelcomeNewCustomer" targetRef="Activity_ProductSelection" />
        <bpmn:exclusiveGateway id="Gateway_OriginationEligibility" name="Is eligible?" default="Flow_OriginationNonEligible">
          <bpmn:incoming>Flow_1mfpp21</bpmn:incoming>
          <bpmn:outgoing>Flow_OriginationNonEligible</bpmn:outgoing>
          <bpmn:outgoing>Flow_OriginationEligible</bpmn:outgoing>
        </bpmn:exclusiveGateway>
        <bpmn:endEvent id="Event_OriginationNonEligible" name="Not eligible">
          <bpmn:incoming>Flow_OriginationNonEligible</bpmn:incoming>
        </bpmn:endEvent>
        <bpmn:sequenceFlow id="Flow_OriginationNonEligible" name="No" sourceRef="Gateway_OriginationEligibility" targetRef="Event_OriginationNonEligible" />
        <bpmn:sequenceFlow id="Flow_1mfpp21" sourceRef="Activity_OriginationEligibilityDecision" targetRef="Gateway_OriginationEligibility" />
        <bpmn:sequenceFlow id="Flow_OriginationEligible" name="Yes" sourceRef="Gateway_OriginationEligibility" targetRef="Activity_OriginationBasicInfo">
          <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">eligible == true</bpmn:conditionExpression>
        </bpmn:sequenceFlow>
        <bpmn:userTask id="Activity_OriginationBasicInfo" name="Capture basic info" camunda:priority="10">
          <bpmn:extensionElements>
            <camunda:formData>
              <camunda:formField id="firstName" label="First Name" type="string" defaultValue="John">
                <camunda:properties>
                  <camunda:property id="tooltip" value="BASIC_TOOLTIP_FIRSTNAME" />
                </camunda:properties>
                <camunda:validation>
                  <camunda:constraint name="maxlength" config="50" />
                  <camunda:constraint name="required" />
                  <camunda:constraint name="minlength" config="2" />
                </camunda:validation>
              </camunda:formField>
              <camunda:formField id="lastName" label="Last Name" type="string">
                <camunda:properties>
                  <camunda:property id="tooltip" value="BASIC_TOOLTIP_LASTNAME" />
                </camunda:properties>
                <camunda:validation>
                  <camunda:constraint name="maxlength" config="50" />
                  <camunda:constraint name="required" />
                  <camunda:constraint name="minlength" config="2" />
                </camunda:validation>
              </camunda:formField>
              <camunda:formField id="dateOfBirth" label="Date of Birth" type="date" datePattern="yyyy-MM-dd">
                <camunda:validation>
                  <camunda:constraint name="max" config="today" />
                </camunda:validation>
              </camunda:formField>
              <camunda:formField id="emailId" label="Last Name" type="string">
                <camunda:properties>
                  <camunda:property id="tooltip" value="BASIC_TOOLTIP_EMAIL" />
                  <camunda:property id="regex" value="regexpression" />
                  <camunda:property id="regexerrmsg" value="BASIC_ERROR_EMAIL_REGEX" />
                </camunda:properties>
                <camunda:validation>
                </camunda:validation>
              </camunda:formField>
            </camunda:formData>
            <camunda:inputOutput>
              <camunda:inputParameter name="mobeixAction">CASABI</camunda:inputParameter>
            </camunda:inputOutput>
          </bpmn:extensionElements>
          <bpmn:incoming>Flow_OriginationEligible</bpmn:incoming>
          <bpmn:outgoing>Flow_14u5ml8</bpmn:outgoing>
        </bpmn:userTask>
        <bpmn:sequenceFlow id="Flow_14u5ml8" sourceRef="Activity_OriginationBasicInfo" targetRef="Activity_WelcomeNewCustomer" />
        <bpmn:textAnnotation id="TextAnnotation_09ivc04">
          <bpmn:text>The customer's mobile number will be the business key</bpmn:text>
        </bpmn:textAnnotation>
        <bpmn:association id="Association_0uz6ejz" sourceRef="StartEvent_Origination" targetRef="TextAnnotation_09ivc04" />
        <bpmn:textAnnotation id="TextAnnotation_0tcf3w0">
          <bpmn:text>Determine which product the customer wants to on-board. The list of products is maintained in MRO Tables.</bpmn:text>
        </bpmn:textAnnotation>
        <bpmn:association id="Association_147cdj1" sourceRef="Activity_ProductSelection" targetRef="TextAnnotation_0tcf3w0" />
        <bpmn:group id="Group_SubProcesses" categoryValueRef="CategoryValue_0ep2993" />
        <bpmn:textAnnotation id="TextAnnotation_0nzkynk">
          <bpmn:text>Sub-processes must return the following process variables:

    1. isOnboardSuccess - TRUE or FALSE flag denoting successful or unsuccessful result
    2. accountNumber - The account number opened as a result of the on-boarding process</bpmn:text>
        </bpmn:textAnnotation>
        <bpmn:association id="Association_1eeo598" sourceRef="Group_SubProcesses" targetRef="TextAnnotation_0nzkynk" />
        <bpmn:textAnnotation id="TextAnnotation_0i18qir">
          <bpmn:text>Determines the CIF number</bpmn:text>
        </bpmn:textAnnotation>
        <bpmn:association id="Association_18rw66h" sourceRef="Activity_CifCheck" targetRef="TextAnnotation_0i18qir" />
        <bpmn:group id="Group_1jwm40l" categoryValueRef="CategoryValue_0nhfxn1" />
      </bpmn:process>
      <bpmn:category id="Category_0udlusk">
        <bpmn:categoryValue id="CategoryValue_0ep2993" value="On-boarding Sub-Processes" />
      </bpmn:category>
      <bpmn:category id="Category_1qbozkx">
        <bpmn:categoryValue id="CategoryValue_0nhfxn1" value="New Customer" />
      </bpmn:category>
      <bpmndi:BPMNDiagram id="BPMNDiagram_1">
        <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="MobeixDigitalOrigination">
          <bpmndi:BPMNEdge id="Flow_14u5ml8_di" bpmnElement="Flow_14u5ml8">
            <di:waypoint x="1120" y="350" />
            <di:waypoint x="1120" y="400" />
          </bpmndi:BPMNEdge>
          <bpmndi:BPMNEdge id="Flow_0uyjldu_di" bpmnElement="Flow_OriginationEligible">
            <di:waypoint x="935" y="310" />
            <di:waypoint x="1070" y="310" />
            <bpmndi:BPMNLabel>
              <dc:Bounds x="978" y="288" width="18" height="14" />
            </bpmndi:BPMNLabel>
          </bpmndi:BPMNEdge>
          <bpmndi:BPMNEdge id="Flow_1mfpp21_di" bpmnElement="Flow_1mfpp21">
            <di:waypoint x="750" y="310" />
            <di:waypoint x="885" y="310" />
          </bpmndi:BPMNEdge>
          <bpmndi:BPMNEdge id="Flow_120kmh4_di" bpmnElement="Flow_OriginationNonEligible">
            <di:waypoint x="910" y="285" />
            <di:waypoint x="910" y="198" />
            <bpmndi:BPMNLabel>
              <dc:Bounds x="918" y="239" width="15" height="14" />
            </bpmndi:BPMNLabel>
          </bpmndi:BPMNEdge>
          <bpmndi:BPMNEdge id="Flow_1fb8gkx_di" bpmnElement="Flow_1fb8gkx">
            <di:waypoint x="1170" y="440" />
            <di:waypoint x="1259" y="440" />
            <di:waypoint x="1259" y="580" />
            <di:waypoint x="1298" y="580" />
          </bpmndi:BPMNEdge>
          <bpmndi:BPMNEdge id="Flow_14sdyy3_di" bpmnElement="Flow_14sdyy3">
            <di:waypoint x="700" y="400" />
            <di:waypoint x="700" y="350" />
          </bpmndi:BPMNEdge>
          <bpmndi:BPMNEdge id="Flow_0pw8zra_di" bpmnElement="Flow_0pw8zra">
            <di:waypoint x="1170" y="690" />
            <di:waypoint x="1260" y="690" />
            <di:waypoint x="1260" y="610" />
            <di:waypoint x="1298" y="610" />
          </bpmndi:BPMNEdge>
          <bpmndi:BPMNEdge id="Flow_06v8nmt_di" bpmnElement="Flow_06v8nmt">
            <di:waypoint x="218" y="597" />
            <di:waypoint x="355" y="597" />
          </bpmndi:BPMNEdge>
          <bpmndi:BPMNEdge id="Flow_0gcamzc_di" bpmnElement="Flow_MobileNoValid">
            <di:waypoint x="405" y="597" />
            <di:waypoint x="490" y="597" />
            <bpmndi:BPMNLabel>
              <dc:Bounds x="421" y="579" width="18" height="14" />
            </bpmndi:BPMNLabel>
          </bpmndi:BPMNEdge>
          <bpmndi:BPMNEdge id="Flow_1u7cres_di" bpmnElement="Flow_MobileNoInvalid">
            <di:waypoint x="380" y="572" />
            <di:waypoint x="380" y="495" />
            <bpmndi:BPMNLabel>
              <dc:Bounds x="388" y="531" width="15" height="14" />
            </bpmndi:BPMNLabel>
          </bpmndi:BPMNEdge>
          <bpmndi:BPMNEdge id="Flow_0q22e0c_di" bpmnElement="Flow_Cancelled">
            <di:waypoint x="380" y="445" />
            <di:waypoint x="380" y="328" />
          </bpmndi:BPMNEdge>
          <bpmndi:BPMNEdge id="Flow_0yrdc21_di" bpmnElement="Flow_MobileNoOtpFailed">
            <di:waypoint x="405" y="470" />
            <di:waypoint x="522" y="470" />
            <bpmndi:BPMNLabel>
              <dc:Bounds x="422" y="452" width="15" height="14" />
            </bpmndi:BPMNLabel>
          </bpmndi:BPMNEdge>
          <bpmndi:BPMNEdge id="Flow_0ikmhot_di" bpmnElement="Flow_ExistingCustomer">
            <di:waypoint x="700" y="622" />
            <di:waypoint x="700" y="690" />
            <di:waypoint x="1070" y="690" />
            <bpmndi:BPMNLabel>
              <dc:Bounds x="708" y="652" width="15" height="14" />
            </bpmndi:BPMNLabel>
          </bpmndi:BPMNEdge>
          <bpmndi:BPMNEdge id="Flow_0j76gz6_di" bpmnElement="Flow_NewCustomer">
            <di:waypoint x="700" y="572" />
            <di:waypoint x="700" y="480" />
            <bpmndi:BPMNLabel>
              <dc:Bounds x="680" y="519" width="18" height="14" />
            </bpmndi:BPMNLabel>
          </bpmndi:BPMNEdge>
          <bpmndi:BPMNEdge id="Flow_17ld8eh_di" bpmnElement="Flow_17ld8eh">
            <di:waypoint x="590" y="597" />
            <di:waypoint x="675" y="597" />
          </bpmndi:BPMNEdge>
          <bpmndi:BPMNEdge id="Flow_1jrvhe6_di" bpmnElement="Flow_1jrvhe6">
            <di:waypoint x="2640" y="597" />
            <di:waypoint x="2760" y="597" />
          </bpmndi:BPMNEdge>
          <bpmndi:BPMNEdge id="Flow_1czmu9d_di" bpmnElement="Flow_1czmu9d">
            <di:waypoint x="1653" y="440" />
            <di:waypoint x="1348" y="440" />
            <di:waypoint x="1348" y="557" />
            <bpmndi:BPMNLabel>
              <dc:Bounds x="1492" y="422" width="18" height="14" />
            </bpmndi:BPMNLabel>
          </bpmndi:BPMNEdge>
          <bpmndi:BPMNEdge id="Flow_133ay4i_di" bpmnElement="Flow_133ay4i">
            <di:waypoint x="1678" y="415" />
            <di:waypoint x="1678" y="328" />
            <bpmndi:BPMNLabel>
              <dc:Bounds x="1686" y="371" width="15" height="14" />
            </bpmndi:BPMNLabel>
          </bpmndi:BPMNEdge>
          <bpmndi:BPMNEdge id="Flow_0zbaroh_di" bpmnElement="Flow_0zbaroh">
            <di:waypoint x="1818" y="440" />
            <di:waypoint x="1703" y="440" />
          </bpmndi:BPMNEdge>
          <bpmndi:BPMNEdge id="Flow_0qsjrz2_di" bpmnElement="Flow_0qsjrz2">
            <di:waypoint x="2290" y="597" />
            <di:waypoint x="2375" y="597" />
          </bpmndi:BPMNEdge>
          <bpmndi:BPMNEdge id="Flow_0t29msk_di" bpmnElement="Flow_0t29msk">
            <di:waypoint x="2070" y="572" />
            <di:waypoint x="2070" y="440" />
            <di:waypoint x="1918" y="440" />
            <bpmndi:BPMNLabel>
              <dc:Bounds x="2017" y="449" width="15" height="14" />
            </bpmndi:BPMNLabel>
          </bpmndi:BPMNEdge>
          <bpmndi:BPMNEdge id="Flow_0hwxzkm_di" bpmnElement="Flow_0hwxzkm">
            <di:waypoint x="2095" y="597" />
            <di:waypoint x="2190" y="597" />
            <bpmndi:BPMNLabel>
              <dc:Bounds x="2134" y="579" width="18" height="14" />
            </bpmndi:BPMNLabel>
          </bpmndi:BPMNEdge>
          <bpmndi:BPMNEdge id="Flow_1irtk8d_di" bpmnElement="Flow_1irtk8d">
            <di:waypoint x="1918" y="597" />
            <di:waypoint x="2045" y="597" />
          </bpmndi:BPMNEdge>
          <bpmndi:BPMNEdge id="Flow_1mxythp_di" bpmnElement="Flow_1mxythp">
            <di:waypoint x="2400" y="572" />
            <di:waypoint x="2400" y="438" />
            <bpmndi:BPMNLabel>
              <dc:Bounds x="2408" y="520" width="15" height="14" />
            </bpmndi:BPMNLabel>
          </bpmndi:BPMNEdge>
          <bpmndi:BPMNEdge id="Flow_0e9k4m2_di" bpmnElement="Flow_0e9k4m2">
            <di:waypoint x="1918" y="710" />
            <di:waypoint x="2070" y="710" />
            <di:waypoint x="2070" y="622" />
          </bpmndi:BPMNEdge>
          <bpmndi:BPMNEdge id="Flow_0kzkzdc_di" bpmnElement="Flow_0kzkzdc">
            <di:waypoint x="2425" y="597" />
            <di:waypoint x="2540" y="597" />
            <bpmndi:BPMNLabel>
              <dc:Bounds x="2444" y="579" width="18" height="14" />
            </bpmndi:BPMNLabel>
          </bpmndi:BPMNEdge>
          <bpmndi:BPMNEdge id="Flow_1tyulch_di" bpmnElement="Flow_Loan">
            <di:waypoint x="1678" y="622" />
            <di:waypoint x="1678" y="710" />
            <di:waypoint x="1818" y="710" />
            <bpmndi:BPMNLabel>
              <dc:Bounds x="1740" y="693" width="31" height="14" />
            </bpmndi:BPMNLabel>
          </bpmndi:BPMNEdge>
          <bpmndi:BPMNEdge id="Flow_0o21lq1_di" bpmnElement="Flow_Casa">
            <di:waypoint x="1703" y="597" />
            <di:waypoint x="1818" y="597" />
            <bpmndi:BPMNLabel>
              <dc:Bounds x="1739" y="579" width="31" height="14" />
            </bpmndi:BPMNLabel>
          </bpmndi:BPMNEdge>
          <bpmndi:BPMNEdge id="Flow_1ye40rr_di" bpmnElement="Flow_1ye40rr">
            <di:waypoint x="1598" y="597" />
            <di:waypoint x="1653" y="597" />
          </bpmndi:BPMNEdge>
          <bpmndi:BPMNEdge id="Flow_162yrkt_di" bpmnElement="Flow_162yrkt">
            <di:waypoint x="1398" y="597" />
            <di:waypoint x="1498" y="597" />
            <bpmndi:BPMNLabel>
              <dc:Bounds x="1417" y="579" width="63" height="14" />
            </bpmndi:BPMNLabel>
          </bpmndi:BPMNEdge>
          <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_Origination">
            <dc:Bounds x="182" y="579" width="36" height="36" />
            <bpmndi:BPMNLabel>
              <dc:Bounds x="159" y="622" width="82" height="27" />
            </bpmndi:BPMNLabel>
          </bpmndi:BPMNShape>
          <bpmndi:BPMNShape id="Activity_01709il_di" bpmnElement="Activity_ProductSelection">
            <dc:Bounds x="1298" y="557" width="100" height="80" />
          </bpmndi:BPMNShape>
          <bpmndi:BPMNShape id="Activity_0iqkhuu_di" bpmnElement="Activity_ProductTypeDecision">
            <dc:Bounds x="1498" y="557" width="100" height="80" />
          </bpmndi:BPMNShape>
          <bpmndi:BPMNShape id="Gateway_0cgw0sn_di" bpmnElement="Gateway_ProductType" isMarkerVisible="true">
            <dc:Bounds x="1653" y="572" width="50" height="50" />
            <bpmndi:BPMNLabel>
              <dc:Bounds x="1646" y="542" width="65" height="14" />
            </bpmndi:BPMNLabel>
          </bpmndi:BPMNShape>
          <bpmndi:BPMNShape id="Activity_04r5ni5_di" bpmnElement="callCasaProcess" bioc:stroke="rgb(30, 136, 229)" bioc:fill="rgb(187, 222, 251)">
            <dc:Bounds x="1818" y="557" width="100" height="80" />
          </bpmndi:BPMNShape>
          <bpmndi:BPMNShape id="Activity_0r15edu_di" bpmnElement="callLoanProcess" bioc:stroke="rgb(251, 140, 0)" bioc:fill="rgb(255, 224, 178)">
            <dc:Bounds x="1818" y="670" width="100" height="80" />
          </bpmndi:BPMNShape>
          <bpmndi:BPMNShape id="Activity_0wrelv7_di" bpmnElement="Activity_ChannelRegistration">
            <dc:Bounds x="2540" y="557" width="100" height="80" />
          </bpmndi:BPMNShape>
          <bpmndi:BPMNShape id="Gateway_0oegdgm_di" bpmnElement="Gateway_ChannelRegistration" isMarkerVisible="true">
            <dc:Bounds x="2375" y="572" width="50" height="50" />
            <bpmndi:BPMNLabel>
              <dc:Bounds x="2323" y="613" width="53" height="14" />
            </bpmndi:BPMNLabel>
          </bpmndi:BPMNShape>
          <bpmndi:BPMNShape id="Event_1ccp9id_di" bpmnElement="Event_CompleteExistingUser">
            <dc:Bounds x="2382" y="402" width="36" height="36" />
            <bpmndi:BPMNLabel>
              <dc:Bounds x="2368" y="372" width="65" height="14" />
            </bpmndi:BPMNLabel>
          </bpmndi:BPMNShape>
          <bpmndi:BPMNShape id="Gateway_1l5sghw_di" bpmnElement="Gateway_OriginationSuccess" isMarkerVisible="true">
            <dc:Bounds x="2045" y="572" width="50" height="50" />
            <bpmndi:BPMNLabel>
              <dc:Bounds x="1995" y="613" width="60" height="14" />
            </bpmndi:BPMNLabel>
          </bpmndi:BPMNShape>
          <bpmndi:BPMNShape id="Activity_0b73yao_di" bpmnElement="Activity_OriginationSuccess">
            <dc:Bounds x="2190" y="557" width="100" height="80" />
          </bpmndi:BPMNShape>
          <bpmndi:BPMNShape id="Activity_1txcg5v_di" bpmnElement="Activity_OriginationFailed">
            <dc:Bounds x="1818" y="400" width="100" height="80" />
          </bpmndi:BPMNShape>
          <bpmndi:BPMNShape id="Gateway_141ebys_di" bpmnElement="Gateway_Reapply" isMarkerVisible="true">
            <dc:Bounds x="1653" y="415" width="50" height="50" />
            <bpmndi:BPMNLabel>
              <dc:Bounds x="1653" y="472" width="51" height="14" />
            </bpmndi:BPMNLabel>
          </bpmndi:BPMNShape>
          <bpmndi:BPMNShape id="Event_081ncbr_di" bpmnElement="Event_NoReapply">
            <dc:Bounds x="1660" y="292" width="36" height="36" />
            <bpmndi:BPMNLabel>
              <dc:Bounds x="1636" y="262" width="86" height="27" />
            </bpmndi:BPMNLabel>
          </bpmndi:BPMNShape>
          <bpmndi:BPMNShape id="Event_1p097xu_di" bpmnElement="Event_CompleteNewUser">
            <dc:Bounds x="2760" y="579" width="36" height="36" />
            <bpmndi:BPMNLabel>
              <dc:Bounds x="2753" y="622" width="55" height="40" />
            </bpmndi:BPMNLabel>
          </bpmndi:BPMNShape>
          <bpmndi:BPMNShape id="Activity_1v9r0wf_di" bpmnElement="Activity_CifCheck">
            <dc:Bounds x="490" y="557" width="100" height="80" />
          </bpmndi:BPMNShape>
          <bpmndi:BPMNShape id="Gateway_1250s5h_di" bpmnElement="Gateway_NewCustomer" isMarkerVisible="true">
            <dc:Bounds x="675" y="572" width="50" height="50" />
            <bpmndi:BPMNLabel>
              <dc:Bounds x="735" y="590" width="77" height="14" />
            </bpmndi:BPMNLabel>
          </bpmndi:BPMNShape>
          <bpmndi:BPMNShape id="Activity_1tis452_di" bpmnElement="Activity_WelcomeExistingCustomer">
            <dc:Bounds x="1070" y="650" width="100" height="80" />
          </bpmndi:BPMNShape>
          <bpmndi:BPMNShape id="Activity_15l0hb4_di" bpmnElement="Activity_WelcomeNewCustomer">
            <dc:Bounds x="1070" y="400" width="100" height="80" />
          </bpmndi:BPMNShape>
          <bpmndi:BPMNShape id="Event_1e2i2en_di" bpmnElement="Event_Cancelled">
            <dc:Bounds x="362" y="292" width="36" height="36" />
            <bpmndi:BPMNLabel>
              <dc:Bounds x="344" y="262" width="73" height="14" />
            </bpmndi:BPMNLabel>
          </bpmndi:BPMNShape>
          <bpmndi:BPMNShape id="Event_13545yc_di" bpmnElement="Event_13545yc">
            <dc:Bounds x="522" y="452" width="36" height="36" />
            <bpmndi:BPMNLabel>
              <dc:Bounds x="498" y="495" width="85" height="27" />
            </bpmndi:BPMNLabel>
          </bpmndi:BPMNShape>
          <bpmndi:BPMNShape id="Gateway_0pestjt_di" bpmnElement="Gateway_OtpFailed" isMarkerVisible="true">
            <dc:Bounds x="355" y="445" width="50" height="50" />
            <bpmndi:BPMNLabel>
              <dc:Bounds x="258" y="460" width="84" height="14" />
            </bpmndi:BPMNLabel>
          </bpmndi:BPMNShape>
          <bpmndi:BPMNShape id="Gateway_0b4p6gq_di" bpmnElement="Gateway_MobileNoCheck" isMarkerVisible="true">
            <dc:Bounds x="355" y="572" width="50" height="50" />
            <bpmndi:BPMNLabel>
              <dc:Bounds x="338" y="632" width="85" height="40" />
            </bpmndi:BPMNLabel>
          </bpmndi:BPMNShape>
          <bpmndi:BPMNShape id="Activity_1swedkz_di" bpmnElement="Activity_OriginationEligibility">
            <dc:Bounds x="650" y="400" width="100" height="80" />
          </bpmndi:BPMNShape>
          <bpmndi:BPMNShape id="Activity_0x5a9ha_di" bpmnElement="Activity_OriginationEligibilityDecision">
            <dc:Bounds x="650" y="270" width="100" height="80" />
          </bpmndi:BPMNShape>
          <bpmndi:BPMNShape id="Gateway_04priq9_di" bpmnElement="Gateway_OriginationEligibility" isMarkerVisible="true">
            <dc:Bounds x="885" y="285" width="50" height="50" />
            <bpmndi:BPMNLabel>
              <dc:Bounds x="884" y="345" width="52" height="14" />
            </bpmndi:BPMNLabel>
          </bpmndi:BPMNShape>
          <bpmndi:BPMNShape id="Event_0oksiui_di" bpmnElement="Event_OriginationNonEligible">
            <dc:Bounds x="892" y="162" width="36" height="36" />
            <bpmndi:BPMNLabel>
              <dc:Bounds x="884" y="132" width="55" height="14" />
            </bpmndi:BPMNLabel>
          </bpmndi:BPMNShape>
          <bpmndi:BPMNShape id="Activity_0wkh5x6_di" bpmnElement="Activity_OriginationBasicInfo">
            <dc:Bounds x="1070" y="270" width="100" height="80" />
          </bpmndi:BPMNShape>
          <bpmndi:BPMNShape id="TextAnnotation_09ivc04_di" bpmnElement="TextAnnotation_09ivc04">
            <dc:Bounds x="220" y="874" width="100" height="68" />
          </bpmndi:BPMNShape>
          <bpmndi:BPMNShape id="TextAnnotation_0tcf3w0_di" bpmnElement="TextAnnotation_0tcf3w0">
            <dc:Bounds x="1368" y="874" width="100" height="124" />
          </bpmndi:BPMNShape>
          <bpmndi:BPMNShape id="Group_07pups3_di" bpmnElement="Group_SubProcesses">
            <dc:Bounds x="1728" y="500" width="260" height="298" />
            <bpmndi:BPMNLabel>
              <dc:Bounds x="1814" y="507" width="88" height="27" />
            </bpmndi:BPMNLabel>
          </bpmndi:BPMNShape>
          <bpmndi:BPMNShape id="TextAnnotation_0nzkynk_di" bpmnElement="TextAnnotation_0nzkynk">
            <dc:Bounds x="2088" y="750" width="510" height="68" />
          </bpmndi:BPMNShape>
          <bpmndi:BPMNShape id="TextAnnotation_0i18qir_di" bpmnElement="TextAnnotation_0i18qir">
            <dc:Bounds x="560" y="874" width="100" height="40" />
          </bpmndi:BPMNShape>
          <bpmndi:BPMNShape id="Group_1jwm40l_di" bpmnElement="Group_1jwm40l">
            <dc:Bounds x="630" y="81" width="570" height="469" />
            <bpmndi:BPMNLabel>
              <dc:Bounds x="878" y="88" width="75" height="14" />
            </bpmndi:BPMNLabel>
          </bpmndi:BPMNShape>
          <bpmndi:BPMNEdge id="Association_0uz6ejz_di" bpmnElement="Association_0uz6ejz">
            <di:waypoint x="204" y="614" />
            <di:waypoint x="266" y="874" />
          </bpmndi:BPMNEdge>
          <bpmndi:BPMNEdge id="Association_147cdj1_di" bpmnElement="Association_147cdj1">
            <di:waypoint x="1355" y="637" />
            <di:waypoint x="1399" y="874" />
          </bpmndi:BPMNEdge>
          <bpmndi:BPMNEdge id="Association_1eeo598_di" bpmnElement="Association_1eeo598">
            <di:waypoint x="1988" y="722" />
            <di:waypoint x="2078" y="772" />
          </bpmndi:BPMNEdge>
          <bpmndi:BPMNEdge id="Association_18rw66h_di" bpmnElement="Association_18rw66h">
            <di:waypoint x="550" y="637" />
            <di:waypoint x="607" y="874" />
          </bpmndi:BPMNEdge>
        </bpmndi:BPMNPlane>
      </bpmndi:BPMNDiagram>
    </bpmn:definitions>`;
  this.diagram1 = `<?xml version="1.0" encoding="UTF-8"?>
  <definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" targetNamespace="" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL http://www.omg.org/spec/BPMN/2.0/20100501/BPMN20.xsd">
    <collaboration id="sid-c0e745ff-361e-4afb-8c8d-2a1fc32b1424">
      <participant id="sid-87F4C1D6-25E1-4A45-9DA7-AD945993D06F" name="Customer" processRef="sid-C3803939-0872-457F-8336-EAE484DC4A04" />
    </collaboration>
    <process id="sid-C3803939-0872-457F-8336-EAE484DC4A04" name="Customer" processType="None" isClosed="false" isExecutable="false">
      <extensionElements />
      <laneSet id="sid-b167d0d7-e761-4636-9200-76b7f0e8e83a">
        <lane id="sid-57E4FE0D-18E4-478D-BC5D-B15164E93254">
          <flowNodeRef>sid-52EB1772-F36E-433E-8F5B-D5DFD26E6F26</flowNodeRef>
          <flowNodeRef>sid-E49425CF-8287-4798-B622-D2A7D78EF00B</flowNodeRef>
          <flowNodeRef>sid-D7F237E8-56D0-4283-A3CE-4F0EFE446138</flowNodeRef>
          <flowNodeRef>sid-E433566C-2289-4BEB-A19C-1697048900D2</flowNodeRef>
          <flowNodeRef>sid-5134932A-1863-4FFA-BB3C-A4B4078B11A9</flowNodeRef>
          <flowNodeRef>SCAN_OK</flowNodeRef>
        </lane>
      </laneSet>
      <task id="sid-52EB1772-F36E-433E-8F5B-D5DFD26E6F26" name="Scan QR code">
        <incoming>sid-4DC479E5-5C20-4948-BCFC-9EC5E2F66D8D</incoming>
        <outgoing>sid-EE8A7BA0-5D66-4F8B-80E3-CC2751B3856A</outgoing>
      </task>
      <task id="sid-E49425CF-8287-4798-B622-D2A7D78EF00B" name="Open product information in mobile  app">
        <incoming>sid-8B820AF5-DC5C-4618-B854-E08B71FB55CB</incoming>
        <outgoing>sid-57EB1F24-BD94-479A-BF1F-57F1EAA19C6C</outgoing>
      </task>
      <startEvent id="sid-D7F237E8-56D0-4283-A3CE-4F0EFE446138" name="Notices&#10;QR code">
        <outgoing>sid-7B791A11-2F2E-4D80-AFB3-91A02CF2B4FD</outgoing>
      </startEvent>
      <endEvent id="sid-E433566C-2289-4BEB-A19C-1697048900D2" name="Is informed">
        <incoming>sid-57EB1F24-BD94-479A-BF1F-57F1EAA19C6C</incoming>
      </endEvent>
      <exclusiveGateway id="sid-5134932A-1863-4FFA-BB3C-A4B4078B11A9">
        <incoming>sid-7B791A11-2F2E-4D80-AFB3-91A02CF2B4FD</incoming>
        <incoming>sid-337A23B9-A923-4CCE-B613-3E247B773CCE</incoming>
        <outgoing>sid-4DC479E5-5C20-4948-BCFC-9EC5E2F66D8D</outgoing>
      </exclusiveGateway>
      <exclusiveGateway id="SCAN_OK" name="Scan successful?&#10;">
        <incoming>sid-EE8A7BA0-5D66-4F8B-80E3-CC2751B3856A</incoming>
        <outgoing>sid-8B820AF5-DC5C-4618-B854-E08B71FB55CB</outgoing>
        <outgoing>sid-337A23B9-A923-4CCE-B613-3E247B773CCE</outgoing>
      </exclusiveGateway>
      <sequenceFlow id="sid-337A23B9-A923-4CCE-B613-3E247B773CCE" name="Yes" sourceRef="SCAN_OK" targetRef="sid-5134932A-1863-4FFA-BB3C-A4B4078B11A9" />
      <sequenceFlow id="sid-4DC479E5-5C20-4948-BCFC-9EC5E2F66D8D" sourceRef="sid-5134932A-1863-4FFA-BB3C-A4B4078B11A9" targetRef="sid-52EB1772-F36E-433E-8F5B-D5DFD26E6F26" />
      <sequenceFlow id="sid-8B820AF5-DC5C-4618-B854-E08B71FB55CB" name="No" sourceRef="SCAN_OK" targetRef="sid-E49425CF-8287-4798-B622-D2A7D78EF00B" />
      <sequenceFlow id="sid-57EB1F24-BD94-479A-BF1F-57F1EAA19C6C" sourceRef="sid-E49425CF-8287-4798-B622-D2A7D78EF00B" targetRef="sid-E433566C-2289-4BEB-A19C-1697048900D2" />
      <sequenceFlow id="sid-EE8A7BA0-5D66-4F8B-80E3-CC2751B3856A" sourceRef="sid-52EB1772-F36E-433E-8F5B-D5DFD26E6F26" targetRef="SCAN_OK" />
      <sequenceFlow id="sid-7B791A11-2F2E-4D80-AFB3-91A02CF2B4FD" sourceRef="sid-D7F237E8-56D0-4283-A3CE-4F0EFE446138" targetRef="sid-5134932A-1863-4FFA-BB3C-A4B4078B11A9" />
    </process>
    <bpmndi:BPMNDiagram id="sid-74620812-92c4-44e5-949c-aa47393d3830">
      <bpmndi:BPMNPlane id="sid-cdcae759-2af7-4a6d-bd02-53f3352a731d" bpmnElement="sid-c0e745ff-361e-4afb-8c8d-2a1fc32b1424">
        <bpmndi:BPMNShape id="sid-87F4C1D6-25E1-4A45-9DA7-AD945993D06F_gui" bpmnElement="sid-87F4C1D6-25E1-4A45-9DA7-AD945993D06F" isHorizontal="true">
          <omgdc:Bounds x="83" y="105" width="933" height="250" />
          <bpmndi:BPMNLabel labelStyle="sid-84cb49fd-2f7c-44fb-8950-83c3fa153d3b">
            <omgdc:Bounds x="47.49999999999999" y="170.42857360839844" width="12.000000000000014" height="59.142852783203125" />
          </bpmndi:BPMNLabel>
        </bpmndi:BPMNShape>
        <bpmndi:BPMNShape id="sid-57E4FE0D-18E4-478D-BC5D-B15164E93254_gui" bpmnElement="sid-57E4FE0D-18E4-478D-BC5D-B15164E93254" isHorizontal="true">
          <omgdc:Bounds x="113" y="105" width="903" height="250" />
        </bpmndi:BPMNShape>
        <bpmndi:BPMNShape id="sid-52EB1772-F36E-433E-8F5B-D5DFD26E6F26_gui" bpmnElement="sid-52EB1772-F36E-433E-8F5B-D5DFD26E6F26">
          <omgdc:Bounds x="393" y="170" width="100" height="80" />
          <bpmndi:BPMNLabel labelStyle="sid-84cb49fd-2f7c-44fb-8950-83c3fa153d3b">
            <omgdc:Bounds x="360.5" y="172" width="84" height="12" />
          </bpmndi:BPMNLabel>
        </bpmndi:BPMNShape>
        <bpmndi:BPMNShape id="sid-E49425CF-8287-4798-B622-D2A7D78EF00B_gui" bpmnElement="sid-E49425CF-8287-4798-B622-D2A7D78EF00B">
          <omgdc:Bounds x="728" y="170" width="100" height="80" />
          <bpmndi:BPMNLabel labelStyle="sid-84cb49fd-2f7c-44fb-8950-83c3fa153d3b">
            <omgdc:Bounds x="695.9285736083984" y="162" width="83.14285278320312" height="36" />
          </bpmndi:BPMNLabel>
        </bpmndi:BPMNShape>
        <bpmndi:BPMNEdge id="sid-EE8A7BA0-5D66-4F8B-80E3-CC2751B3856A_gui" bpmnElement="sid-EE8A7BA0-5D66-4F8B-80E3-CC2751B3856A">
          <omgdi:waypoint x="493" y="210" />
          <omgdi:waypoint x="585" y="210" />
          <bpmndi:BPMNLabel>
            <omgdc:Bounds x="494" y="185" width="90" height="20" />
          </bpmndi:BPMNLabel>
        </bpmndi:BPMNEdge>
        <bpmndi:BPMNEdge id="sid-8B820AF5-DC5C-4618-B854-E08B71FB55CB_gui" bpmnElement="sid-8B820AF5-DC5C-4618-B854-E08B71FB55CB">
          <omgdi:waypoint x="635" y="210" />
          <omgdi:waypoint x="728" y="210" />
          <bpmndi:BPMNLabel labelStyle="sid-e0502d32-f8d1-41cf-9c4a-cbb49fecf581">
            <omgdc:Bounds x="642" y="185" width="16" height="12" />
          </bpmndi:BPMNLabel>
        </bpmndi:BPMNEdge>
        <bpmndi:BPMNEdge id="sid-7B791A11-2F2E-4D80-AFB3-91A02CF2B4FD_gui" bpmnElement="sid-7B791A11-2F2E-4D80-AFB3-91A02CF2B4FD">
          <omgdi:waypoint x="223" y="210" />
          <omgdi:waypoint x="275" y="210" />
          <bpmndi:BPMNLabel>
            <omgdc:Bounds x="204" y="185" width="90" height="20" />
          </bpmndi:BPMNLabel>
        </bpmndi:BPMNEdge>
        <bpmndi:BPMNEdge id="sid-4DC479E5-5C20-4948-BCFC-9EC5E2F66D8D_gui" bpmnElement="sid-4DC479E5-5C20-4948-BCFC-9EC5E2F66D8D">
          <omgdi:waypoint x="325" y="210" />
          <omgdi:waypoint x="393" y="210" />
          <bpmndi:BPMNLabel>
            <omgdc:Bounds x="314" y="185" width="90" height="20" />
          </bpmndi:BPMNLabel>
        </bpmndi:BPMNEdge>
        <bpmndi:BPMNEdge id="sid-57EB1F24-BD94-479A-BF1F-57F1EAA19C6C_gui" bpmnElement="sid-57EB1F24-BD94-479A-BF1F-57F1EAA19C6C">
          <omgdi:waypoint x="828" y="210" />
          <omgdi:waypoint x="901" y="210" />
          <bpmndi:BPMNLabel>
            <omgdc:Bounds x="820" y="185" width="90" height="20" />
          </bpmndi:BPMNLabel>
        </bpmndi:BPMNEdge>
        <bpmndi:BPMNEdge id="sid-337A23B9-A923-4CCE-B613-3E247B773CCE_gui" bpmnElement="sid-337A23B9-A923-4CCE-B613-3E247B773CCE">
          <omgdi:waypoint x="611" y="234" />
          <omgdi:waypoint x="610.5" y="299" />
          <omgdi:waypoint x="300.5" y="299" />
          <omgdi:waypoint x="301" y="234" />
          <bpmndi:BPMNLabel labelStyle="sid-e0502d32-f8d1-41cf-9c4a-cbb49fecf581">
            <omgdc:Bounds x="585" y="236" width="21" height="12" />
          </bpmndi:BPMNLabel>
        </bpmndi:BPMNEdge>
        <bpmndi:BPMNShape id="StartEvent_0l6sgn0_di" bpmnElement="sid-D7F237E8-56D0-4283-A3CE-4F0EFE446138">
          <omgdc:Bounds x="187" y="192" width="36" height="36" />
          <bpmndi:BPMNLabel>
            <omgdc:Bounds x="182" y="229" width="46" height="24" />
          </bpmndi:BPMNLabel>
        </bpmndi:BPMNShape>
        <bpmndi:BPMNShape id="EndEvent_0xwuvv5_di" bpmnElement="sid-E433566C-2289-4BEB-A19C-1697048900D2">
          <omgdc:Bounds x="901" y="192" width="36" height="36" />
          <bpmndi:BPMNLabel>
            <omgdc:Bounds x="892" y="231" width="56" height="12" />
          </bpmndi:BPMNLabel>
        </bpmndi:BPMNShape>
        <bpmndi:BPMNShape id="ExclusiveGateway_1g0eih2_di" bpmnElement="sid-5134932A-1863-4FFA-BB3C-A4B4078B11A9" isMarkerVisible="true">
          <omgdc:Bounds x="275" y="185" width="50" height="50" />
          <bpmndi:BPMNLabel>
            <omgdc:Bounds x="210" y="160" width="90" height="12" />
          </bpmndi:BPMNLabel>
        </bpmndi:BPMNShape>
        <bpmndi:BPMNShape id="ExclusiveGateway_0vci1x5_di" bpmnElement="SCAN_OK" isMarkerVisible="true">
          <omgdc:Bounds x="585" y="185" width="50" height="50" />
          <bpmndi:BPMNLabel>
            <omgdc:Bounds x="568" y="157" width="88" height="24" />
          </bpmndi:BPMNLabel>
        </bpmndi:BPMNShape>
      </bpmndi:BPMNPlane>
      <bpmndi:BPMNLabelStyle id="sid-e0502d32-f8d1-41cf-9c4a-cbb49fecf581">
        <omgdc:Font name="Arial" size="11" isBold="false" isItalic="false" isUnderline="false" isStrikeThrough="false" />
      </bpmndi:BPMNLabelStyle>
      <bpmndi:BPMNLabelStyle id="sid-84cb49fd-2f7c-44fb-8950-83c3fa153d3b">
        <omgdc:Font name="Arial" size="12" isBold="false" isItalic="false" isUnderline="false" isStrikeThrough="false" />
      </bpmndi:BPMNLabelStyle>
    </bpmndi:BPMNDiagram>
  </definitions>`
   }


   zoomIn() {
    const elem = document.getElementById('canvas');
    this.width = this.width+10;
    elem.style.width = this.width + "%";
    this.viewer.get('canvas').zoom('fit-viewport');
   }
  zoomOut() {
    const elem = document.getElementById('canvas');
    this.width = this.width-10;
    elem.style.width = this.width + "%";
    this.viewer.get('canvas').zoom('fit-viewport');
  }
  resetZoom() {
    const elem = document.getElementById('canvas');
    this.width = 90;
    elem.style.width = this.width + "%";
    this.viewer.get('canvas').zoom('fit-viewport');
    this.viewer.get('canvas').zoom('fit-viewport');
  }

  hideLogo(){
    document.getElementsByClassName("bjs-powered-by")[0].innerHTML="";
  }

  ngAfterViewInit() {
    this.renderBPMN()
  }

  renderBPMN() {
    document.getElementById('canvas').draggable;
    this.viewer = new BpmnViewer({
      container: '#canvas'
    });
    this.viewer.importXML(this.diagram).then((result) => {
      const { warnings } = result;
      this.viewer.get('canvas').zoom('fit-viewport');
      this.hideLogo();
    }).catch(function(err) {
      const { warnings, message } = err;
      console.log('something went wrong:', warnings, message);
    });
  }

}
