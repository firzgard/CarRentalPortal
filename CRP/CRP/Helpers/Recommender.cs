using System;
using System.Collections.Generic;
using System.Linq;
using CRP.Controllers;
using CRP.Models;
using CRP.Models.Entities;
using CRP.Models.Entities.Services;
using CRP.Models.ViewModels;

namespace CRP.Helpers
{
	public class Recommender : BaseController
	{
		public List<VehicleFilterModel> CalculateRecommendScoreForSearchResults(List<VehicleFilterModel> vehicleList, AspNetUser user)
		{
			// If there is no booking, go no further
			if (!user.BookingReceipts.Any())
				return vehicleList;
			
			var brandList = this.Service<IBrandService>().Get().ToList();
			var categoryList = this.Service<ICategoryService>().Get().ToList();
			var modelService = this.Service<IModelService>();
			var numOfSeatList = modelService.Get().Select(m => m.NumOfSeat).Distinct().Where(s => s != 0).ToList();
			var numOfDoorList = modelService.Get().Select(m => m.NumOfDoor).Distinct().Where(s => s != 0).ToList();

			// Get the list of userIds of users that has booked a same vehicle with this user.
			// Exclude this user
			var neighborIdList = user.BookingReceipts
					.SelectMany(b => b.Vehicle.BookingReceipts
												.Where(br => br.CustomerID != br.Garage.OwnerID)
												.Select(br => br.CustomerID))
					.Where(id => id != user.Id)
					.Distinct()
					.ToList();

			// Calc num of attribute
			var numOfAttribute = Constants.TRANSMISSION_TYPE.Count
			                     + Constants.FUEL_TYPE.Count
			                     + Constants.COLOR.Count
								 + numOfSeatList.Count
								 + numOfDoorList.Count
								 + brandList.Count
			                     + categoryList.Count
			                     + neighborIdList.Count;

			// User profile is built from attribute vectors
			var userProfile = BuildUserProfile(user, brandList, categoryList,
											numOfSeatList,
											numOfDoorList,
											neighborIdList.Count,
											numOfAttribute);

			// Build the attribute vectors for each vehicle
			foreach (var vehicle in vehicleList)
			{
				vehicle.AttributeVectorList = CalculateAttributeVectorsOfVehicle(vehicle,
																		neighborIdList,
																		numOfSeatList,
																		numOfDoorList,
																		brandList,
																		categoryList);
			}

			// Build the IDF vector (Also a list of attribute vectors)
			var idfVector = new List<double>();
			for (var i = 0; i < numOfAttribute; i++)
			{
				// Plus 1 for df to prevent dividedByZero
				var df = vehicleList.Count(v => v.AttributeVectorList[i].CompareTo(0) != 0) + 1;
				idfVector.Add(Math.Log10((double)vehicleList.Count/df));
			}

			// Finally, score the items in itemList
			foreach (var item in vehicleList)
			{
				item.RecommendScore = item.AttributeVectorList
						.Zip(idfVector, (av1, av2) => av1*av2)
						.Zip(userProfile, (av1, av2) => av1*av2)
						.Sum();
			}

			return vehicleList;
		}

		public List<double> BuildUserProfile(AspNetUser user,
					List<VehicleBrand> brandList,
					List<Category> categoryList,
					List<int> numOfSeatList,
					List<int> numOfDoorList,
					int numOfSimilarUser,
					int numOfAttribute)
		{
			// Calculate attribute vectors for each booking

			var bookingList = new List<List<double>>();
			foreach (var booking in user.BookingReceipts)
			{
				bookingList.Add(CalculateAttributeVectorsOfBooking(booking,
																numOfSimilarUser,
																numOfSeatList,
																numOfDoorList,
																brandList,
																categoryList));
			}

			// Generate user profile by calc each attribute vector based on his booking history
			var userProfile = new List<double>();
			for (var i = 0; i < numOfAttribute; i++)
			{
				var vector = 0.0;

				// Each attribute vector of user profile equal the sum of product
				// between each booking's attribute vector of the same type
				// with user's rating for that booking
				for (int j = 0, lim = bookingList.Count; j < lim; j++)
				{
					var userRating = user.BookingReceipts.ToList()[j].Star;
					// Assume the rating for booking that has not been rated is 2.5
					var star = userRating == null ? 2.5 : (double)userRating;

					vector += bookingList[j][i]*star;
				}

				userProfile.Add(vector);
			}

			return userProfile;
		}

		// Calc the attribute vectors of an user's booking
		public List<double> CalculateAttributeVectorsOfBooking (BookingReceipt booking,
															int numOfSimilarUser,
															List<int> numOfSeatList,
															List<int> numOfDoorList,
															List<VehicleBrand> brandList,
															List<Category> categoryList)
		{
			var vectorList = new List<double>();

			// TranmissionType Attributes
			foreach (var attribute in Constants.TRANSMISSION_TYPE)
			{
				vectorList.Add(booking.Vehicle.TransmissionType == attribute.Key ? 1 : 0);
			}

			// FuelType Attributes
			foreach (var attribute in Constants.FUEL_TYPE)
			{
				vectorList.Add(booking.Vehicle.FuelType == attribute.Key ? 1 : 0);
			}

			// Color Attributes
			foreach (var attribute in Constants.COLOR)
			{
				vectorList.Add(booking.Vehicle.Color == attribute.Key ? 1 : 0);
			}

			// NumOfSeat Attributes
			foreach (var attribute in numOfSeatList)
			{
				vectorList.Add(booking.Vehicle.VehicleModel.NumOfSeat == attribute ? 1 : 0);
			}

			// NumOfDoor Attributes
			foreach (var attribute in numOfDoorList)
			{
				vectorList.Add(booking.Vehicle.VehicleModel.NumOfDoor == attribute ? 1 : 0);
			}

			// Brand Attributes
			foreach (var attribute in brandList)
			{
				vectorList.Add(booking.Vehicle.VehicleModel.BrandID == attribute.ID ? 1 : 0);
			}

			// Category Attributes
			foreach (var attribute in categoryList)
			{
				vectorList.Add(booking.Vehicle.VehicleModel.Categories.Contains(attribute) ? 1 : 0);
			}

			// Get the number of attribute length value that equals 1
			var numOfEqual1Attribute = vectorList.Count(v => v.CompareTo(1) == 0) + numOfSimilarUser;

			// Similar user attributes. All 1
			for (var i = 0; i < numOfSimilarUser; i++)
			{
				vectorList.Add(1);
			}

			// Calc the length of master vector
			var divisor = Math.Sqrt(numOfEqual1Attribute);

			// Return the nomalized vectors.
			// Lengths of normalized vectors are calc by dividing it by the master vector's length
			return vectorList.Select(v => v / divisor).ToList();
		}

		// Calc the attribute vectors of a vehicle
		public List<double> CalculateAttributeVectorsOfVehicle(VehicleFilterModel vehicle,
															List<string> neighborIdList,
															List<int> numOfSeatList,
															List<int> numOfDoorList,
															List<VehicleBrand> brandList,
															List<Category> categoryList)
		{
			var vectorList = new List<double>();

			// TranmissionType Attributes
			foreach (var attribute in Constants.TRANSMISSION_TYPE)
			{
				vectorList.Add(vehicle.TransmissionType == attribute.Key ? 1 : 0);
			}

			// FuelType Attributes
			foreach (var attribute in Constants.FUEL_TYPE)
			{
				vectorList.Add(vehicle.FuelType == attribute.Key ? 1 : 0);
			}

			// Color Attributes
			foreach (var attribute in Constants.COLOR)
			{
				vectorList.Add(vehicle.Color == attribute.Key ? 1 : 0);
			}

			// NumOfSeat Attributes
			foreach (var attribute in numOfSeatList)
			{
				vectorList.Add(vehicle.NumOfSeat == attribute ? 1 : 0);
			}

			// NumOfDoor Attributes
			foreach (var attribute in numOfDoorList)
			{
				vectorList.Add(vehicle.NumOfDoor == attribute ? 1 : 0);
			}

			// Brand Attributes
			foreach (var attribute in brandList)
			{
				vectorList.Add(vehicle.BrandID == attribute.ID ? 1 : 0);
			}

			// Category Attributes
			foreach (var attribute in categoryList)
			{
				vectorList.Add(vehicle.Categories.Contains(attribute) ? 1 : 0);
			}

			// Similar user attributes.
			foreach (var neighborId in neighborIdList)
			{
				vectorList.Add(vehicle.CustomerIdList.Any(id => id == neighborId) ? 1: 0);
			}


			// Get the number of attribute length value that equals 1
			var numOfEqual1Attribute = vectorList.Count(v => v.CompareTo(1) == 0);

			// Calc the length of master vector
			var divisor = Math.Sqrt(numOfEqual1Attribute);

			// Return the nomalized vectors.
			// Lengths of normalized vectors are calc by dividing it by the master vector's length
			return vectorList.Select(v => v / divisor).ToList();
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
		public int NumOfDoor { get; set; }
		public List<string> CategoryList { get; set; }
		public List<string> ImageList { get; set; }
		// Shortest rental period of this vehicle that fit the filter
		public int BestPossibleRentalPeriod { get; set; }
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
			NumOfDoor = vehicle.VehicleModel.NumOfDoor;
			BrandID = vehicle.VehicleModel.BrandID;
			Categories = vehicle.VehicleModel.Categories.ToList();

			ImageList = vehicle.VehicleImages.Select(i => i.URL).ToList();

			TransmissionTypeName = Constants.TRANSMISSION_TYPE[vehicle.TransmissionType];
			FuelTypeName = vehicle.FuelType == null ? null : Constants.FUEL_TYPE[vehicle.FuelType.Value];

			// Get the list of userid of users that has booked this vehicle
			CustomerIdList = vehicle.BookingReceipts.Select(b => b.CustomerID).Distinct().ToList();

			// Find the best PriceGroupItem that match the search
			var items = vehicle.VehicleGroup.PriceGroup.PriceGroupItems.OrderBy(x => x.MaxTime);
			foreach (var item in items)
			{
				if (item.MaxTime >= rentalTime)
				{
					BestPossibleRentalPeriod = item.MaxTime;
					BestPossibleRentalPrice = item.Price;
					break;
				}
			}
			// If not found, use the PerDayPrice
			if (BestPossibleRentalPrice.CompareTo(0) == 0)
			{
				BestPossibleRentalPeriod = 24;
				BestPossibleRentalPrice = vehicle.VehicleGroup.PriceGroup.PerDayPrice;
			}
		}
	}
}

