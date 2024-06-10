/* eslint-disable react/prop-types */
import React from 'react';
import { useState } from 'react';
import PondSelect from '../components/pondselect/pondselect';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import DataChart from '../components/datachart/datachart';
import DataTable from '../components/datatable/datatable';
import { Container } from '@mui/material';
import DataBlock from '../components/datablock/datablock';
import { useThresholdContext } from '../ThresholdContext';

function DashboardPage({ data }) {
  const [selectedPond, setSelectedPond] = useState('');
  const { tempThreshold } = useThresholdContext();

  // For now, forced set statuses for all ponds
  // TODO: dynamic pond statuses based on thresholds or if sensors not working
  const pondStatuses = {
    'Pond 1': 'ok',
    'Pond 2': 'ok',
    'Pond 3': 'ok',
    'Pond 4': 'ok',
    'Pond 5': 'ok',
    'Pond 6': 'ok',
    'Pond 7': 'ok',
    'Pond 8': 'ok',
    'Pond 9': 'ok',
    'Pond 10': 'ok'
  };

  // For the big dot next to the pond choice menu
  const getOverallStatus = () => {
    const statuses = Object.values(pondStatuses);
    if (statuses.includes('error')) return 'red';
    if (statuses.includes('warning')) return 'yellow';
    return 'green';
  };
  const overallStatus = getOverallStatus();

  const handleSelectChange = (event) => {
    setSelectedPond(event.target.value);
  };

  // Define column labels for different data types
  const columns = {
    temp: [
      { id: 'timestamp', label: 'Timestamp' },
      { id: 'temp_celsius', label: 'Celsius' },
      { id: 'temp_fahrenheit', label: 'Fahrenheit' }
    ],
    ph: [
      { id: 'timestamp', label: 'Timestamp' },
      { id: 'ph_value', label: 'pH Value' }
    ],
    tds: [
      { id: 'timestamp', label: 'Timestamp' },
      { id: 'tds_value', label: 'TDS Value' }
    ]
  };

  const getDataKeyY = (name) => {
    switch (name) {
      case 'Temp':
        return 'temp_fahrenheit';
      case 'Ph':
        return 'ph_value';
      case 'Tds':
        return 'tds_value';
      default:
        return '';
    }
  };

  return (
    <div>
      <PondSelect
        selectedPond={selectedPond}
        handleSelectChange={handleSelectChange}
        pondStatuses={pondStatuses}
        overallStatus={overallStatus}
      />
      <Container>
        <Grid container spacing={3} justifyContent="center">
          {Object.keys(data).map((key) => {
            const name = key.charAt(0).toUpperCase() + key.slice(1);
            //console.log(`Rendering components for key: ${key}, name: ${name}, data:`, data[key]);
            return (
              <React.Fragment key={key}>
                {/* Chart */}
                <Grid item xs={12} md={8} lg={8}>
                  <Paper
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignContent: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <DataChart
                      name={name}
                      data={data[key]}
                      dataKeyX="timestamp"
                      dataKeyY={getDataKeyY(name)}
                    />
                  </Paper>
                </Grid>

                {/* Data Block */}
                <Grid item xs={12} md={4} lg={4}>
                  <DataBlock
                    name={name}
                    data={data[key]}
                  />
                </Grid>

                {/* DataTable */}
                <Grid item xs={12} md={10} lg={10}>
                  <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                    <DataTable
                      tablename={name}
                      columns={columns[key]}
                      dataRef={`${key}Data`}
                      data={data[key]}
                      tempThreshold={tempThreshold}
                    />
                  </Paper>
                </Grid>
              </React.Fragment>
            );
          })}
        </Grid>
      </Container>
    </div>
  );
}

export default DashboardPage;
