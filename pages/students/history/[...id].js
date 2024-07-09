import React, { useState, useEffect } from 'react';
import Layout from '../../../components/Layouts/Layout';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineIcon from '@mui/icons-material/Timeline';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useSession } from "next-auth/react";

function StudentRegistrationPhaseHistory() {
  const router = useRouter();
  const { id } = router.query;
  const [name, setName] = useState("");
  const [vuid, setVuid] = useState("");
  const [history, setHistory] = useState([]);
  const [isError, setIsError] = useState(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id && session?.user?.data?.access_token) {
          const response = await axios.get(`/students/student_registration_phaseHistory/${id}`, {
            headers: {
              "Authorization": `Bearer ${session.user.data.access_token}`
            }
          });
          setName(response.data.registationHistory.name);
          setVuid(response.data.registationHistory.vuid);
          setHistory(response.data.registationHistory.studentregistrations);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsError(error);
      }
    };

    fetchData();
  }, [id, session]);

  return (
    <Layout>
      <Card>
         <div className='bg-bg p-2 text-center text-white text-2xl font-serif font-bold'>
            Student Registration History
          </div>
        <CardContent>
         
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-black">ID</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{vuid}</dd>
              </div>
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-black">Name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{name}</dd>
              </div>
              <div>
                <ul>
                  {history.map((batch, index) => (
                    <li key={batch.id}>
                      <label className="text-md leading-none pb-6">Registration {index + 1}</label>
                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls={`panel${index + 1}-content`}
                          id={`panel${index + 1}-header`}
                        >
                          {batch.batch.name}
                        </AccordionSummary>
                        <AccordionDetails>
                          <Timeline>
                            {batch.phaseHistory.map((phase, phaseIndex) => (
                              <TimelineItem key={phaseIndex}>
                                <TimelineOppositeContent
                                  sx={{ m: 'auto 0' }}
                                  align="right"
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  <span className='text-black font-bold'>
                                    {new Date(phase.processed_on).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
                                    {' '}
                                    <br />
                                    {new Date(phase.processed_on).toLocaleTimeString([], { hour12: true })}
                                  </span>
                                </TimelineOppositeContent>
                                <TimelineSeparator>
                                  <TimelineConnector />
                                  <TimelineDot className={index % 2 === 0 ? "bg-[#88B7DF]" : "bg-[#D4E1F3]"}>
                                    <TimelineIcon />
                                  </TimelineDot>
                                  <TimelineConnector />
                                </TimelineSeparator>
                                <TimelineContent>
                                  <Card className={`shadow-xl shadow-blue-200 ${index % 2 === 0 ? "bg-[#88B7DF]" : "bg-[#D4E1F3]"}`}>
                                    <div className='bg-blend-lighten bg-opacity-90 p-6 rounded-lg shadow-lg container-fluid'>
                                      <Typography className="font-semibold text-md">{phase.phases.name}</Typography>
                                      <Typography>{phase.comments}</Typography>
                                      <Typography><b>Processed by: </b>{phase.processed_by.fullname}</Typography>
                                    </div>
                                  </Card>
                                </TimelineContent>
                              </TimelineItem>
                            ))}
                          </Timeline>
                        </AccordionDetails>
                      </Accordion>
                    </li>
                  ))}
                </ul>
              </div>
            </dl>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
}

export default StudentRegistrationPhaseHistory;
