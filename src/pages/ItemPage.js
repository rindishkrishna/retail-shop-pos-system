import React, { useEffect, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useDispatch } from "react-redux";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import { Modal, Button, Table, Form, Input, Select, message, InputNumber } from "antd";
import { addDoc, collection, setDoc,updateDoc, deleteDoc, doc, query, onSnapshot } from "firebase/firestore";
import { firestore } from '../firebase';
import { v4 as uuidv4 } from 'uuid';
import data from "../utils/data"
const ItemPage = () => {
  const dispatch = useDispatch();
  const [itemsData, setItemsData] = useState([]);
  const [popupModal, setPopupModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const getAllItems = async () => {
    // try {
    //   dispatch({
    //     type: "SHOW_LOADING",
    //   });
    //   // const { data } = await axios.get("/api/items/get-item");
    //   setItemsData(data);
    //   dispatch({ type: "HIDE_LOADING" });
    //   console.log(data);
    // } catch (error) {
    //   dispatch({ type: "HIDE_LOADING" });
    //   console.log(error);
    // }

    const data = await query(collection(firestore, "test_data"));
    onSnapshot(data, (querySnapshot) => {
    const databaseInfo = [];
      querySnapshot.forEach((doc) => {
      databaseInfo.push({ ...doc.data(), id: doc.id });
      });
        setItemsData(databaseInfo)
      });

  };
  //useEffect
  useEffect(() => {
    getAllItems();
    //eslint-disable-next-line
  }, []);

  //handle deleet
  const handleDelete = async (record) => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      await deleteDoc(doc(firestore, "test_data", record.id));
      // await axios.post("/api/items/delete-item", { itemId: record._id });
      message.success("Item Deleted Succesfully");
      getAllItems();
      setPopupModal(false);
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      message.error("Something Went Wrong");
      console.log(error);
    }
  };

  //able data
  const columns = [
    { title: "Name", dataIndex: "name" },
    { title: "Price", dataIndex: "price" },
    {
      title: "Actions",
      dataIndex: "id",
      render: (id, record) => (
        <div>
          <EditOutlined
            style={{ cursor: "pointer" }}
            onClick={() => {
              setEditItem(record);
              setPopupModal(true);
            }}
          />
          <DeleteOutlined
            style={{ cursor: "pointer" }}
            onClick={() => {
              handleDelete(record);
            }}
          />
        </div>
      ),
    },
  ];

  // handle form  submit
  const handleSubmit = async (value) => {
    if (editItem === null) {
      try {
        dispatch({
          type: "SHOW_LOADING",
        });
        value["id"]=uuidv4();
        await addDoc(collection(firestore, "test_data"), value);
        message.success("Item Added Succesfully");
        getAllItems();
        setPopupModal(false);
        dispatch({ type: "HIDE_LOADING" });
      } catch (error) {
        dispatch({ type: "HIDE_LOADING" });
        message.error("Something Went Wrong");
        console.log(error);
      }
    } else {
      try {
        dispatch({
          type: "SHOW_LOADING",
        });
        value["id"]=editItem.id;
        await updateDoc(doc(firestore, "test_data", editItem.id), value);

        message.success("Item Updated Succesfully");
        getAllItems();
        setPopupModal(false);
        dispatch({ type: "HIDE_LOADING" });
      } catch (error) {
        dispatch({ type: "HIDE_LOADING" });
        message.error("Something Went Wrong");
        console.log(error);
      }
    }
  };

  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between">
        <h1>Item List</h1>
        <Button type="primary" onClick={() => setPopupModal(true)}>
          Add Item
        </Button>
      </div>

      <Table columns={columns} dataSource={itemsData} bordered />

      {popupModal && (
        <Modal
          title={`${editItem !== null ? "Edit Item " : "Add New Item"}`}
          visible={popupModal}
          onCancel={() => {
            setEditItem(null);
            setPopupModal(false);
          }}
          footer={false}
        >
          <Form
            layout="vertical"
            initialValues={editItem}
            onFinish={handleSubmit}
          >
            <Form.Item name="name" label="Name">
              <Input />
            </Form.Item>
            <Form.Item name="price" label="Price">
              <Input type="number" />
            </Form.Item>
            <div className="d-flex justify-content-end">
              <Button type="primary" htmlType="submit">
                SAVE
              </Button>
            </div>
          </Form>
        </Modal>
      )}
    </DefaultLayout>
  );
};

export default ItemPage;
