import React, { useCallback, useEffect, useState } from "react";
import { Redirect, useHistory, useParams } from "react-router";
import { Form, Input, Button, Typography, message } from "antd";
import {
  basicRoutePathName,
  routeToMappingData,
  IRoutePathNameComponentToEle,
} from "../types/defultType";
import { useDispatch, useSelector } from "react-redux";
import { ROOTSTATE } from "../redux_folder/reducers/root";
import {
  loginAdminInfoAction,
  loginAdminAPI,
} from "../redux_folder/actions/admin/index";
import { Link } from "react-router-dom";
import {
  createAdminInfoAction,
  resetIntegrataionMessage,
} from "../redux_folder/actions/admin/index";
import {
  studentFindStudentCodeAction,
  studentModifyStudentInfoAction,
  studentLoginInfoAction,
} from "../redux_folder/actions/student/index";
import { Content } from "antd/lib/layout/layout";
const { Title } = Typography;
interface IRouteInfo {
  stubing: typeof basicRoutePathName[number];
}
const layout = {
  labelCol: { span: 2, offset: 1 },
  wrapperCol: { span: 10 },
};
const MainInputPage = () => {
  const [form] = Form.useForm();
  const { stubing } = useParams<IRouteInfo>();
  let history = useHistory();
  const [serilizeData, setSerilizeData] =
    useState<IRoutePathNameComponentToEle | null>(null);
  const {
    integrationErrorMessage,
    integrationRequestMessage,
    integrationSucessMessage,
    requestStudentInfo,
    studentInfo,
  } = useSelector((state: ROOTSTATE) => state.student);
  const {
    integrationSucessMessage: adminSuccessMeesage,
    integrationErrorMessage: adminErrorMessage,
    integrationRequestMessage: adminRequestMessage,
  } = useSelector((state: ROOTSTATE) => state.admin);

  const dispatch = useDispatch();

  useEffect(() => {
    console.log("MainInputPage useEffect");
    setSerilizeData(
      routeToMappingData.filter(value => value.pathName === stubing)[0]
    );
  }, [stubing]);
  useEffect(() => {
    if (integrationErrorMessage) {
      message.error(integrationErrorMessage);
    }
  }, [integrationErrorMessage, integrationRequestMessage]);
  useEffect(() => {
    console.log("integrationRequestMessage userEffect");
    if (adminErrorMessage) {
      message.error(adminErrorMessage);
      dispatch(resetIntegrataionMessage());
    }
  }, [adminErrorMessage, adminRequestMessage, adminSuccessMeesage]);

  const onFinish = useCallback(
    (values: any) => {
      if (stubing === "admin") {
        const { name, password } = values;
        dispatch(
          loginAdminInfoAction.ACTION.REQUEST({
            name,
            password,
          })
        );
      }
      if (stubing === "find" || stubing == "make" || stubing === "step") {
        const { name, studentCode } = values;
        if (stubing === "find") {
          dispatch(
            studentLoginInfoAction.ACTION.REQUEST({ name, studentCode })
          );
        }
        if (stubing === "step") {
          dispatch(
            studentFindStudentCodeAction.ACTION.REQUEST({ name, studentCode })
          );
        }
        if (stubing === "make") {
          dispatch(
            studentFindStudentCodeAction.ACTION.REQUEST({ name, studentCode })
          );
        }
      }

      if (stubing === "makeadmin") {
        const { name, hashCode, password, phoneNumber } = values;
        dispatch(
          createAdminInfoAction.ACTION.REQUEST({
            name,
            hashCode,
            password,
            phoneNumber,
          })
        );
      }
    },
    [stubing]
  );
  // 페이지 전환 처음
  if (integrationSucessMessage) {
    if (stubing === "make") {
      return (
        <Redirect
          to={{
            pathname: "/student/create",
            state: requestStudentInfo,
          }}
        />
      );
    }
    if (stubing === "find") {
      if (studentInfo?.email && studentInfo?.password)
        return <Redirect to="/student/main" />;
      else return <Redirect to="/student/default" />;
    }
  }
  if (adminSuccessMeesage) {
    if (stubing === "admin") {
      return <Redirect to="/admin/main" />;
    }
  }
  // 페이지 전환 끝
  if (stubing !== "portfolio")
    return (
      <>
        <Content className="home-page wrapper content0">
          <Form
            {...layout}
            form={form}
            name="control-hooks"
            onFinish={onFinish}
          >
            {" "}
            <Title level={2}>{serilizeData?.categoryName}</Title>
            {serilizeData?.formTagInInputEl.map((value, index) => (
              <Form.Item
                name={value.name}
                label={value.label}
                rules={[{ required: true }]}
              >
                <Input type={value.inputType} />
              </Form.Item>
            ))}
            <Button type="primary" htmlType="submit">
              제출
            </Button>
            {/* {stubing === "admin" ? (
              <Button>
                <Link to="/makeadmin">관리자 계정 생성</Link>
              </Button>
            ) : null} */}
            {stubing === "makeadmin" && (
              <Button>
                <Link to="/admin">이전 화면</Link>
              </Button>
            )}
          </Form>
        </Content>
      </>
    );
  else return <></>;
};

export default MainInputPage;
