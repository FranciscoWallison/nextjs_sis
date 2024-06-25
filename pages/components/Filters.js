// components/Filters.js

import React, { useState, useEffect } from 'react';
import { TextField, Grid, Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

const Filters = ({ filters, setFilters, applyFilters }) => {
  const [selectedDateRange, setSelectedDateRange] = useState([null, null]);

  const handleChangeDateRange = (newDates) => {
    setSelectedDateRange(newDates);
    if (newDates[0] && newDates[1]) {
      const startDate = newDates[0];
      const endDate = newDates[1];
      const startMonth = startDate.toLocaleString('default', { month: 'long' });
      const endMonth = endDate.toLocaleString('default', { month: 'long' });
      const startYear = startDate.getFullYear();
      const endYear = endDate.getFullYear();
      if (startYear === endYear && startMonth === endMonth) {
        setFilters((prev) => ({
          ...prev,
          ano: startYear,
          mes: startMonth,
        }));
      } else {
        setFilters((prev) => ({
          ...prev,
          ano: '',
          mes: '',
        }));
      }
    } else {
      setFilters((prev) => ({
        ...prev,
        ano: '',
        mes: '',
      }));
    }
  };

  useEffect(() => {
    if (filters.ano && filters.mes) {
      setSelectedDateRange([
        new Date(`${filters.mes} 1, ${filters.ano}`),
        new Date(`${filters.mes} 1, ${filters.ano}`),
      ]);
    } else {
      setSelectedDateRange([null, null]);
    }
  }, [filters]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} md={3}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateRangePicker
            startText="Data de início"
            endText="Data de término"
            value={selectedDateRange}
            onChange={handleChangeDateRange}
            renderInput={(startProps, endProps) => (
              <>
                <TextField {...startProps} fullWidth />
                <TextField {...endProps} fullWidth />
              </>
            )}
          />
        </LocalizationProvider>
      </Grid>
      <Grid item xs={12} md={3}>
        <TextField
          label="Tipo de Equipamento"
          name="tipo_equipamento"
          value={filters.tipo_equipamento || ''}
          onChange={handleChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <Button variant="contained" color="primary" onClick={applyFilters} fullWidth>
          Aplicar Filtros
        </Button>
      </Grid>
    </Grid>
  );
};

export default Filters;
