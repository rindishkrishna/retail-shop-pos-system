import React, { useState, useEffect } from "react";
import DefaultLayout from "../components/DefaultLayout";
import axios from "axios";
import { Row, Col } from "antd";
import { useDispatch } from "react-redux";
import ItemList from "../components/ItemList";
import { addDoc, collection, setDoc,updateDoc, deleteDoc, doc, query, onSnapshot } from "firebase/firestore";
import { firestore } from '../firebase';
const Homepage = () => {
  const [itemsData, setItemsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  //useEffect
  useEffect(() => {
    const getAllItems = async () => {
      try {
        dispatch({
          type: "SHOW_LOADING",
        });
        // const { data } = await axios.get("/api/items/get-item");
        const data = await query(collection(firestore, "test_data"));
        onSnapshot(data, (querySnapshot) => {
        const databaseInfo = [];
          querySnapshot.forEach((doc) => {
          databaseInfo.push({ ...doc.data(), id: doc.id });
          });
            setItemsData(databaseInfo)
          });
        dispatch({ type: "HIDE_LOADING" });
      } catch (error) {
        console.log(error);
      }
    };
    getAllItems();
  }, [dispatch]);
  return (
    <DefaultLayout>
      <input
        type="text"
        placeholder="Search..."
        // value={itemsData}
        onChange={handleInputChange}
        style={{
          width: '100%',
          height: '50px',
          fontSize: '20px',
          padding: '10px',
          borderRadius: '5px',
          border: 'none',
          boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
          marginBottom:'20px'
        }}
      />
      <div className="d-flex">
      </div>
      <Row>
        {itemsData
    .filter(post => {
    if (searchTerm === '') {
      return post;
    } else if (post.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return post;
    }
  }).map((item) => (
            <Col xs={24} lg={6} md={12} sm={6}>
              <ItemList key={item.id} item={item} />
            </Col>
          ))}
      </Row>
    </DefaultLayout>
  );
};

export default Homepage;
