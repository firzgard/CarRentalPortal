using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CRP.Controllers;
using CRP.Models;
using CRP.Models.Entities;
using CRP.Models.Entities.Services;
using CRP.Models.ViewModels;

namespace CRP.Helpers
{
	public class Recommender : BaseController
	{
		public List<VehicleFilterModel> CalculateRecommendScoreForSearchResults(List<VehicleFilterModel> itemList , AspNetUser user)
		{
			// If there is no booking, go no further
			if (!user.BookingReceipts.Any())
				return itemList;
			
			var brandList = this.Service<IBrandService>().Get().ToList();
			var categoryList = this.Service<ICategoryService>().Get().ToList();

			// Calc num of attribute
			var numOfAttribute = Constants.TRANSMISSION_TYPE.Count
								+ Constants.FUEL_TYPE.Count
								+ Constants.COLOR.Count
								+ brandList.Count()
								+ categoryList.Count();

			// Get the list of userIds of users that has booked a same vehicle with this user.
			var similarUserIdList = user.BookingReceipts
					.SelectMany(b => b.Vehicle.BookingReceipts.Select(b2 => b2.CustomerID))
					.Distinct().ToList();

			// User profile is built from attribute vectors
			var userProfile = BuildUserProfile(user, brandList, categoryList, similarUserIdList.Count(), numOfAttribute);

			// Build the attribute vectors for each item
			foreach (var item in itemList)
			{
				item.AttributeVectorList = CalculateAttributeVectorsOfItem(item.TransmissionType,
																		item.FuelType,
																		item.Color,
																		item.BrandID,
																		item.Categories,
																		item.CustomerIdList.Count(id => similarUserIdList.Contains(id)),
																		brandList,
																		categoryList);
			}

			// Build the IDF vector (Also a list of attribute vectors)
			var idfVector = new List<double>();
			for (var i = 0; i < numOfAttribute; i++)
			{
				var df = itemList.Count(item => item.AttributeVectorList[i] != 0);
				idfVector.Add(Math.Log10(itemList.Count/df));
			}

			// Finally, score the items in itemList
			foreach (var item in itemList)
			{
				item.RecommendScore = item.AttributeVectorList
						.Zip(idfVector, (av1, av2) => av1*av2)
						.Zip(userProfile, (av1, av2) => av1*av2)
						.Sum();
			}

			return itemList;
		}

		public List<double> BuildUserProfile(AspNetUser user,
					List<VehicleBrand> brandList,
					List<Category> categoryList,
					int numOfSimilarUser,
					int numOfAttribute)
		{
			// Calculate attribute vectors for each booking

			var bookingList = new List<List<double>>();
			foreach (var booking in user.BookingReceipts)
			{
				bookingList.Add(CalculateAttributeVectorsOfItem(booking.TransmissionType,
																booking.FuelType,
																booking.Color,
																booking.VehicleModel.BrandID,
																booking.VehicleModel.Categories.ToList(),
																numOfSimilarUser,
																brandList,
																categoryList));
			}

			// Generate user profile by calc each attribute vector based on his booking history
			var userProfile = new List<double>();
			for (int i = 0; i < numOfAttribute; i++)
			{
				var vector = 0.0;

				// Each attribute vector of user profile equal the sum of product
				// between each booking's attribute vector of the same type
				// with user's rating for that booking
				for (int j = 0, lim = bookingList.Count; j < lim; j++)
				{
					var userRating = user.BookingReceipts.ToList()[i].Star;
					// Assume the rating for booking that has not been rated is 2.5
					var star = userRating == null ? 2.5 : (double)userRating;

					vector += bookingList[j][i]*star;
				}

				userProfile.Add(vector);
			}

			return userProfile;
		}

		// Calc the attribute vectors of an item
		public List<double> CalculateAttributeVectorsOfItem (int transmissionType,
															int? fuelType,
															int? color,
															int vehicleBrandId,
															List<Category> vehicleCategories,
															int numOfSimilarUser,
															List<VehicleBrand> brandList,
															List<Category> categoryList)
		{
			var vectorList = new List<double>();

			// TranmissionType Attributes
			foreach (var attribute in Constants.TRANSMISSION_TYPE)
			{
				vectorList.Add(transmissionType == attribute.Key ? 1 : 0);
			}

			// FuelType Attributes
			foreach (var attribute in Constants.FUEL_TYPE)
			{
				vectorList.Add(fuelType == attribute.Key ? 1 : 0);
			}

			// Color Attributes
			foreach (var attribute in Constants.COLOR)
			{
				vectorList.Add(color == attribute.Key ? 1 : 0);
			}

			// Brand Attributes
			foreach (var attribute in brandList)
			{
				vectorList.Add(vehicleBrandId == attribute.ID ? 1 : 0);
			}

			// Category Attributes
			foreach (var attribute in categoryList)
			{
				vectorList.Add(vehicleCategories.Contains(attribute) ? 1 : 0);
			}

			// Num of customer that has booked this item and also has booked a vehicle that this user has book before.
			vectorList.Add(numOfSimilarUser);

			// Get the number of attribute length value that equals 1
			var numOfTruthyAttribute = vectorList.Count(v => v == 1);

			// Calc the divisor to nomalize the attribute vectors
			var divisor = Math.Sqrt(numOfTruthyAttribute);

			// Return the nomalized vectors
			return vectorList.Select(v => v /= divisor).ToList();
		}
	}

	// Model to filter the vehicle in search
	public class VehicleFilterModel : VehicleRecordJsonModel
	{
		public string Location { get; set; }
		public string GarageName { get; set; }
		public int GarageNumOfComment { get; set; }
		public decimal GarageRating { get; set; }
		public string TransmissionTypeName { get; set; }
		public string FuelTypeName { get; set; }
		public List<string> CategoryList { get; set; }
		public List<string> ImageList { get; set; }
		// Shortest rental period of this vehicle that fit the filter
		public string BestPossibleRentalPeriod { get; set; }
		// Lowest price range of this vehicle that fit the filter
		public double BestPossibleRentalPrice { get; set; }


		public int TransmissionType { get; set; }
		public int? FuelType { get; set; }
		public int? Color { get; set; }
		public int BrandID { get; set; }
		public List<Category> Categories { get; set; }
		public List<string> CustomerIdList { get; set; }

		// Attribute vectors
		public List<double> AttributeVectorList { get; set; }

		// Recommender's scored result
		public double RecommendScore { get; set; }

		public VehicleFilterModel(Vehicle vehicle, int rentalTime) : base(vehicle)
		{
			Location = vehicle.Garage.Location.Name;
			GarageName = vehicle.Garage.Name;
			GarageNumOfComment = vehicle.Garage.NumOfComment;
			GarageRating = vehicle.Garage.Star;
			TransmissionType = vehicle.TransmissionType;
			FuelType = vehicle.FuelType;
			Color = vehicle.Color;
			BrandID = vehicle.VehicleModel.BrandID;
			Categories = vehicle.VehicleModel.Categories.ToList();

			ImageList = vehicle.VehicleImages.Select(i => i.URL).ToList();

			TransmissionTypeName = Constants.TRANSMISSION_TYPE[vehicle.TransmissionType];

			if (vehicle.FuelType != null)
			{
				FuelTypeName = Constants.FUEL_TYPE[vehicle.FuelType.Value];
			}

			// Get the list of userid of users that has booked this vehicle
			CustomerIdList = vehicle.BookingReceipts.Select(b => b.CustomerID).Distinct().ToList();

			// Find the best PriceGroupItem that match the search
			var items = vehicle.VehicleGroup.PriceGroup.PriceGroupItems.OrderBy(x => x.MaxTime);
			foreach (var item in items)
			{
				if (item.MaxTime >= rentalTime)
				{
					BestPossibleRentalPeriod = item.MaxTime + "&nbsp;giờ";
					BestPossibleRentalPrice = item.Price;
					break;
				}
			}
			// If not found, use the PerDayPrice
			if (BestPossibleRentalPrice == 0.0d)
			{
				BestPossibleRentalPeriod = "ngày";
				BestPossibleRentalPrice = vehicle.VehicleGroup.PriceGroup.PerDayPrice;
			}
		}
	}
}