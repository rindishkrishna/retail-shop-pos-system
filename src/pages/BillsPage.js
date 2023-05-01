import React, { useEffect, useState, useRef } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useSelector, useDispatch } from "react-redux";
import { EyeOutlined } from "@ant-design/icons";
import ReactToPrint from "react-to-print";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { Modal, Button, Table } from "antd";
import "../styles/InvoiceStyles.css";
import { addDoc, collection, setDoc,updateDoc, deleteDoc, doc, query, onSnapshot } from "firebase/firestore";
import { firestore } from '../firebase';
import {useLocation} from 'react-router-dom';
const BillsPage = () => {
  const componentRef = useRef();
  const dispatch = useDispatch();
  const [billsData, setBillsData] = useState([]);
  const [popupModal, setPopupModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const { cartItems } = useSelector((state) => state.rootReducer);
  const location = useLocation();
  const getAllBills = async () => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      // const { data } = await axios.get("/api/bills/get-bills");
      const data = await query(collection(firestore, "bill"));
      await localStorage.removeItem("cartItems", JSON.stringify(cartItems));
      dispatch({
        type: "DELETE_ALL_FROM_CART",
        payload: cartItems,
      })
      onSnapshot(data, (querySnapshot) => {
      const databaseInfo = [];
        querySnapshot.forEach((doc) => {
        databaseInfo.push({ ...doc.data()});
        });
        setBillsData(databaseInfo)
        });
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      console.log(error);
    }
  };
  //useEffect
  useEffect(() => {

    getAllBills();
    if(location.state){
      console.log(location.state)
      setSelectedBill(location.state);
      setPopupModal(true);
    }
    //eslint-disable-next-line
  }, []);
  //print function
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  //able data
  const columns = [
    { title: "ID ", dataIndex: "id" },
    { title: "Total Amount", dataIndex: "subTotal" },
    {
      title: "Actions",
      dataIndex: "id",
      render: (id, record) => (
        <div>
          <EyeOutlined
            style={{ cursor: "pointer" }}
            onClick={() => {
              console.log(record)
              setSelectedBill(record);
              setPopupModal(true);
            }}
          />
        </div>
      ),
    },
  ];
  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between">
        <h1>Invoice list</h1>
      </div>

      <Table columns={columns} dataSource={billsData} bordered />

      {popupModal && (
        <Modal
          width={400}
          pagination={false}
          title="Invoice Details"
          visible={popupModal}
          onCancel={() => {
            setPopupModal(false);
          }}
          footer={false}
        >
          {/* ============ invoice modal start ==============  */}
          <div id="invoice-POS" ref={componentRef}>
            <center id="top">
              {/* <div className="logo" /> */}
              <div className="info">
                <h2>BEERU SONS</h2>
                <p>KAIPAMANGALAM , KOORIKKUZHI, THRISSUR, 680681, +91 9746656021</p>
              </div>
              {/*End Info*/}
            </center>
            {/*End InvoiceTop*/}
            <div id="mid">
              <div className="mt-2">
                <p>
                  Bill ID : {selectedBill.id}
                  <br />
                  Date : <b>{selectedBill.date}</b>
                  <br />
                </p>
                <hr style={{ margin: "5px" }} />
              </div>
            </div>
            {/*End Invoice Mid*/}
            <div id="bot">
              <div id="table">
                <table>
                  <tbody>
                    <tr className="tabletitle">
                      <td className="item">
                        <h2>Item</h2>
                      </td>
                      <td className="Hours">
                        <h2>Qty</h2>
                      </td>
                      <td className="Rate">
                        <h2>Price</h2>
                      </td>
                      <td className="Rate">
                        <h2>Total</h2>
                      </td>
                    </tr>
                    {selectedBill.cartItems.map((item) => (
                      <>
                        <tr className="service">
                          <td className="tableitem">
                            <p className="itemtext">{item.name}</p>
                          </td>
                          <td className="tableitem">
                            <p className="itemtext">{item.quantity}</p>
                          </td>
                          <td className="tableitem">
                            <p className="itemtext">{item.price}</p>
                          </td>
                          <td className="tableitem">
                            <p className="itemtext">
                              {item.quantity * item.price}
                            </p>
                          </td>
                        </tr>
                      </>
                    ))}

                    <tr className="tabletitle">
                      <td className="Rate">
                        <h2>Grand Total</h2>
                      </td>
                      <td className="payment">
                        <h2>
                          <b>₹{selectedBill.subTotal}</b>
                        </h2>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/*End Table*/}
              <div id="legalcopy">
                <p className="legal">
                  <strong>Thank you for your order!</strong>
                </p>
              </div>
            </div>
            {/*End InvoiceBot*/}
          </div>
          {/*End Invoice*/}
          <div className="d-flex justify-content-end mt-3">
            <Button type="primary" onClick={handlePrint}>
              Print
            </Button>
          </div>
          {/* ============ invoice modal ends ==============  */}
        </Modal>
      )}
    </DefaultLayout>
  );
};

export default BillsPage;
