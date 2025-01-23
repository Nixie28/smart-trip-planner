import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Select,
  NumberInput,
  NumberInputField,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
} from '@chakra-ui/react';

const TripPlannerForm = () => {
  const [tripData, setTripData] = useState({
    destinations: [],
    startDate: '',
    endDate: '',
    travelers: 1,
    budget: [0, 5000],
    accommodationType: 'both', // 'hotel', 'airbnb', or 'both'
    activities: []
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here we'll add the API call to our backend
    try {
      const response = await fetch('/api/plan-trip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tripData),
      });
      const data = await response.json();
      // Handle the response data
    } catch (error) {
      console.error('Error planning trip:', error);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} p={6} borderWidth="1px" borderRadius="lg">
      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Destinations</FormLabel>
          <Input
            placeholder="Add destinations (comma-separated)"
            onChange={(e) => setTripData({
              ...tripData,
              destinations: e.target.value.split(',').map(d => d.trim())
            })}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Start Date</FormLabel>
          <Input
            type="date"
            onChange={(e) => setTripData({
              ...tripData,
              startDate: e.target.value
            })}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>End Date</FormLabel>
          <Input
            type="date"
            onChange={(e) => setTripData({
              ...tripData,
              endDate: e.target.value
            })}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Number of Travelers</FormLabel>
          <NumberInput min={1} max={10}>
            <NumberInputField
              onChange={(e) => setTripData({
                ...tripData,
                travelers: parseInt(e.target.value)
              })}
            />
          </NumberInput>
        </FormControl>

        <FormControl>
          <FormLabel>Accommodation Type</FormLabel>
          <Select
            onChange={(e) => setTripData({
              ...tripData,
              accommodationType: e.target.value
            })}
          >
            <option value="both">Both Hotels & Airbnb</option>
            <option value="hotel">Hotels Only</option>
            <option value="airbnb">Airbnb Only</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Budget Range ($)</FormLabel>
          <RangeSlider
            defaultValue={[0, 5000]}
            min={0}
            max={10000}
            step={100}
            onChange={(values) => setTripData({
              ...tripData,
              budget: values
            })}
          >
            <RangeSliderTrack>
              <RangeSliderFilledTrack />
            </RangeSliderTrack>
            <RangeSliderThumb index={0} />
            <RangeSliderThumb index={1} />
          </RangeSlider>
        </FormControl>

        <Button type="submit" colorScheme="blue">
          Plan My Trip
        </Button>
      </VStack>
    </Box>
  );
};

export default TripPlannerForm;