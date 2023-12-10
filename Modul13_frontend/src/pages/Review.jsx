import React from 'react'
import { useState, useEffect } from 'react'
import { Alert, Container, Stack, Row, Spinner, Card, Form, Col, Button, Image } from 'react-bootstrap'
import { GetReviewById, PostReview } from '../api/apiReview';
import { useParams } from 'react-router-dom';
import { GetContentById } from '../api/apiContent';
import { getThumbnail } from "../api";
import { FaVideo, FaTrashAlt } from "react-icons/fa";
import { toast } from 'react-toastify';
import profile from "../assets/images/profile.png";
import { DeleteContent } from '../api/apiContent';

function Review() {
    const [review, setreview] = useState([]);
    const [content, setContent] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [data, setData] = useState("");
    const { id } = useParams()

    const handleChange = (event) => {
        setData(event.target.value);
    }

    const handleDelete = (id) => {
        setIsPending(true);
        DeleteContent(id).then((response) => {
            setIsPending(false);
            toast.success("review deleted ");
        }).catch((err) => {
            console.log(err);
            setIsPending(false);
            toast.dark(err.message);
        })
    }

    const handleReview = (id) => {
        const formData = new FormData();
        if (data === "") {
            toast.error("Review must be filled");
        } else {

            formData.append("comment", data);
            PostReview(formData, id)
                .then(response => {
                    console.log("Review posted successfully:", response.data);
                    toast.success("Review Added");
                    setIsPending(true);
                })
                .catch(error => {
                    console.error("Error posting review:", error);
                });
        }
    }


    useEffect(() => {
        setIsPending(false);
        setIsLoading(true);
        GetReviewById(id).then((data) => {
            setreview(data);
            console.log(data, "data review");
        }).catch((err) => {
            console.log(err);
        });
        GetContentById(id)
            .then((data) => {
                setContent(data);
                setIsLoading(false);
                console.log(data, "data content");
            })
            .catch((err) => {
                console.log(err);
            });
    }, [id, isPending]);

    return (
        <Container className="mt-4">
            <Stack direction="horizontal" gap={3} className="mb-3">
                <h1 className="h4 fw-bold mb-0 text-nowrap text-white">Review Video</h1>
                <hr className="border-top border-light opacity-50 w-100" />
            </Stack>
            {
                isLoading ? (
                    <div className="text-center">
                        <Spinner
                            as="span"
                            animation="border"
                            variant="primary"
                            size="lg"
                            role="status"
                            aria-hidden="true"
                        />
                        <h6 className="mt-2 mb-0">Loading...</h6>
                    </div>
                ) : (
                    <>
                        <Card >
                            <Row>
                                <Col sm={8} style={{ height: "500px" }}>
                                    <Card.Img className='img-fluid' variant="top" src={getThumbnail(content.thumbnail)} style={{ maxHeight: "100%", objectFit: "cover" }} />
                                </Col>
                                <Col sm={4}>
                                    <Card.Body>
                                        <FaVideo size={35} />
                                        <Card.Title>{content.title}</Card.Title>
                                        <Card.Text>
                                            {content.description}
                                        </Card.Text>
                                    </Card.Body>
                                </Col>
                            </Row>
                        </Card>
                        <div>
                            <p className='fw-bold mt-2'>Reviews</p>
                            <p>Tuliskan Review Baru</p>
                        </div>
                        <div style={{ width: "100%", paddingBlock: "15px" }}>
                            <Form className='d-flex gap-2' onSubmit={(e) => {
                                e.preventDefault();
                                handleReview(id);
                            }}>
                                <Form.Control
                                    type="text"
                                    placeholder='Add New Review'
                                    onChange={handleChange}
                                />
                                <Button variant="primary" type='submit'>Kirim</Button>
                            </Form>
                        </div>
                        {
                            review?.length > 0 ? (
                                review?.map((item, index) => (
                                    <div className='d-flex gap-2 border rounded p-3 justify-content-between align-items-center' key={index}>
                                        <div className='d-flex gap-2'>
                                            <div style={{ height: "50px", width: "50px" }}>

                                                <Image
                                                    src={profile}
                                                    alt=""
                                                    roundedCircle
                                                    style={{ height: "100%", width: "100%", objectFit: "cover" }}
                                                />
                                            </div>
                                            <div>
                                                <p className='m-0 p-0'>@{item.user.handle}</p>
                                                <p className='m-0 p-0'>{item.comment}</p>
                                            </div>
                                        </div>
                                        <Button variant='danger' onClick={() => handleDelete(item.id)}>
                                            <FaTrashAlt />
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <Alert variant="dark" className="text-center">
                                    Belum ada review, ayo tambahkan review!
                                </Alert>
                            )
                        }
                    </>
                )
            }
        </Container >
    )
}

export default Review