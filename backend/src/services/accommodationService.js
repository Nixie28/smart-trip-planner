const puppeteer = require('puppeteer');
const axios = require('axios');

class AccommodationService {
  async searchAirbnb(location, checkIn, checkOut, guests) {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      const page = await browser.newPage();
      
      // Construct Airbnb search URL
      const url = `https://www.airbnb.com/s/${encodeURIComponent(location)}/homes?checkin=${checkIn}&checkout=${checkOut}&adults=${guests}`;
      
      await page.goto(url);
      await page.waitForSelector('[itemprop="itemListElement"]', { timeout: 5000 });

      // Extract listing data
      const listings = await page.evaluate(() => {
        const items = document.querySelectorAll('[itemprop="itemListElement"]');
        return Array.from(items).map(item => ({
          title: item.querySelector('[itemprop="name"]')?.innerText,
          price: item.querySelector('[data-testid="price-item-total"]')?.innerText,
          link: item.querySelector('a')?.href,
          image: item.querySelector('img')?.src,
          rating: item.querySelector('[aria-label*="rating"]')?.getAttribute('aria-label'),
        }));
      });

      return listings;
    } catch (error) {
      console.error('Error scraping Airbnb:', error);
      return [];
    } finally {
      await browser.close();
    }
  }

  async searchHotels(location, checkIn, checkOut, guests) {
    try {
      // Using a hotel booking API (example with Booking.com API)
      const response = await axios.get('https://distribution-xml.booking.com/json/bookings', {
        params: {
          city: location,
          checkin: checkIn,
          checkout: checkOut,
          guests: guests,
          // Add your API credentials here
          apiKey: process.env.BOOKING_API_KEY
        }
      });

      return response.data.hotels.map(hotel => ({
        name: hotel.name,
        price: hotel.price,
        rating: hotel.rating,
        address: hotel.address,
        images: hotel.images,
        amenities: hotel.amenities
      }));
    } catch (error) {
      console.error('Error fetching hotel data:', error);
      return [];
    }
  }

  async searchAllAccommodations(location, checkIn, checkOut, guests, type = 'both') {
    const results = {
      airbnb: [],
      hotels: []
    };

    if (type === 'both' || type === 'airbnb') {
      results.airbnb = await this.searchAirbnb(location, checkIn, checkOut, guests);
    }

    if (type === 'both' || type === 'hotel') {
      results.hotels = await this.searchHotels(location, checkIn, checkOut, guests);
    }

    return results;
  }
}

module.exports = new AccommodationService();