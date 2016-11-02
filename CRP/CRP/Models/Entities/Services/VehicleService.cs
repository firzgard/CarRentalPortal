using System;
using System.Linq;
using CRP.Models.Entities.Repositories;
using CRP.Models.ViewModels;
using System.Collections.Generic;
using System.Data.Entity.Core.Common.CommandTrees;

namespace CRP.Models.Entities.Services
{
	public interface IVehicleService : IService<Vehicle>
	{
		SearchResultJsonModel SearchVehicle(SearchConditionModel filterConditions);
		VehicleDataTablesJsonModel FilterVehicle(VehicleManagementFilterConditionModel filterConditions);
	}

	public class VehicleService : BaseService<Vehicle>, IVehicleService
	{
		public VehicleService(IUnitOfWork unitOfWork, IVehicleRepository repository) : base(unitOfWork, repository)
		{

		}

		public SearchResultJsonModel SearchVehicle(SearchConditionModel filterConditions)
		{
			var vehicles = repository.Get(v => v.VehicleGroupID != null && v.VehicleGroup.IsActive && v.Garage.IsActive);
			
			// Transmission condition
			if (filterConditions.TransmissionTypeIDList != null)
				vehicles = vehicles.Where(v => filterConditions.TransmissionTypeIDList.Contains(v.TransmissionType));

			// Color condition
			if (filterConditions.ColorIDList != null)
				vehicles = vehicles.Where(v => filterConditions.ColorIDList.Contains(v.Color));

			// FuelType condition
			if (filterConditions.FuelTypeIDList != null)
				vehicles = vehicles.Where(v => filterConditions.FuelTypeIDList.Contains(v.FuelType));

			// Location condition
			if (filterConditions.LocationID != null)
				vehicles = vehicles.Where(v => filterConditions.LocationID == v.Garage.LocationID);

			// Category condition
			if (filterConditions.CategoryIDList != null)
				vehicles = vehicles.Where(v => v.VehicleModel.Categories.Any(r => filterConditions.CategoryIDList.Contains(r.ID)));

			// Max/Min ProductionYear condition
			// Do not validate Max > Min here. Do it before this in the controller
			if (filterConditions.MaxProductionYear != null && filterConditions.MinProductionYear != null)
				vehicles = vehicles.Where(v => v.Year <= filterConditions.MaxProductionYear
											&& v.Year >= filterConditions.MinProductionYear);

			// Max/Min GarageRating condition
			if (filterConditions.MinGarageRating != null)
				vehicles = vehicles.Where(v => v.Garage.Star >= filterConditions.MinGarageRating);

			// Max/Min VehicleRating condition
			if (filterConditions.MinVehicleRating != null)
				vehicles = vehicles.Where(v => v.Star >= filterConditions.MinVehicleRating);

			// Brand and Model condition
			if (filterConditions.BrandIDList.Any() || filterConditions.ModelIDList.Any())
				vehicles = vehicles.Where(v => filterConditions.BrandIDList.Contains(v.VehicleModel.BrandID)
											|| filterConditions.ModelIDList.Contains(v.ModelID));

			// NumOfSeatList condition
			if (filterConditions.NumberOfSeatList != null)
				vehicles = vehicles.Where(v => filterConditions.NumberOfSeatList.Contains(v.VehicleModel.NumOfSeat));

			// Get the rental time in hour
			var rentalTimeSpan = (DateTime)filterConditions.EndTime - (DateTime)filterConditions.StartTime;
			var rentalTime = (int)Math.Ceiling(rentalTimeSpan.TotalHours);

			// vehicleGroup's max rental time constraint
			vehicles = vehicles.Where(v => v.VehicleGroup.PriceGroup.MaxRentalPeriod == null
										|| v.VehicleGroup.PriceGroup.MaxRentalPeriod * 24 > rentalTime);

			// get only vehicles that are free in the booking period condition
			vehicles = vehicles.Where(v =>
				!(v.BookingReceipts.Any(br => !br.IsCanceled
					&& (
						   (filterConditions.StartTime > br.StartTime && filterConditions.StartTime < br.EndTime)
						|| (filterConditions.EndTime > br.StartTime && filterConditions.EndTime < br.EndTime)
						|| (filterConditions.StartTime <= br.StartTime && filterConditions.EndTime >= br.EndTime)
					)))
			);

			// Check StartTime/EndTime to be within garage's OpenTime ~ CloseTime
			// Compare by convert time to the number of minute from 00:00
			// Max margin of error: 60 secs w/ CloseTime (Because we do not validate to second)

			// Booking StartTime
			var startDayInDoW = (int)filterConditions.StartTime.Value.DayOfWeek;
			var startTimeInMunute = filterConditions.StartTime.Value.Minute + filterConditions.StartTime.Value.Hour * 60;
			vehicles = vehicles.Where(v =>
				v.Garage.GarageWorkingTimes.Any(gwt => gwt.DayOfWeek == startDayInDoW
							  && startTimeInMunute >= gwt.OpenTimeInMinute
							  && startTimeInMunute <= gwt.CloseTimeInMinute)
			);

			// Booking EndTime
			var endDayInDoW = (int) filterConditions.EndTime.Value.DayOfWeek;
			var endTimeInMunute = filterConditions.EndTime.Value.Minute + filterConditions.EndTime.Value.Hour * 60;
			vehicles = vehicles.Where(v =>
				v.Garage.GarageWorkingTimes.Any(gwt => gwt.DayOfWeek == endDayInDoW
							  && endTimeInMunute >= gwt.OpenTimeInMinute
							  && endTimeInMunute <= gwt.CloseTimeInMinute)
			);

			// Parse into model suitable to send back to browser
			var results = vehicles.ToList().Select(vehicle => new SearchResultItemJsonModel(vehicle, rentalTime));

			double? averagePrice = null;
			if (results.Any())
				averagePrice = results.Average(r => r.BestPossibleRentalPrice);

			// Max/Min Price conditions
			// Do not validate MaxPrice > MinPrice here. Do it before this in the controller
			if (filterConditions.MaxPrice != null
				&& filterConditions.MinPrice != null)
			{
				results = results.Where(
					r => filterConditions.MaxPrice >= r.BestPossibleRentalPrice
						&& filterConditions.MinPrice <= r.BestPossibleRentalPrice
				);
			}

			// Sort
			// Validate OrderBy in the controller
			if (filterConditions.OrderBy == null)
			{
				results = results.OrderBy(r => r.BestPossibleRentalPeriod)
								.ThenByDescending(r => r.Star)
								.ThenByDescending(r => r.NumOfComment);
			}
			else
			{
				var sortingProp = typeof(SearchResultItemJsonModel).GetProperty(filterConditions.OrderBy);

				// Keep the order descending for star and comment if those are not the main sorting prop
				// Ensure that the magical string represent attribute name exist
				if (filterConditions.IsDescendingOrder)
				{
					if (nameof(SearchResultItemJsonModel.Star) == filterConditions.OrderBy)
						results = results.OrderByDescending(r => r.Star)
										.ThenByDescending(r => r.NumOfComment);
					else if (nameof(SearchResultItemJsonModel.NumOfComment) == filterConditions.OrderBy)
						results = results.OrderByDescending(r => r.NumOfComment)
										.ThenByDescending(r => r.Star);
					else
						results = results.OrderByDescending(r => sortingProp.GetValue(r))
										.ThenByDescending(r => r.Star)
										.ThenByDescending(r => r.NumOfComment);
				}
				else
				{
					if (nameof(SearchResultItemJsonModel.Star) == filterConditions.OrderBy)
						results = results.OrderBy(r => r.Star)
										.ThenBy(r => r.NumOfComment);
					else if (nameof(SearchResultItemJsonModel.NumOfComment) == filterConditions.OrderBy)
						results = results.OrderBy(r => r.NumOfComment)
										.ThenBy(r => r.Star);
					else
						results = results.OrderBy(r => sortingProp.GetValue(r))
										.ThenByDescending(r => r.Star)
										.ThenByDescending(r => r.NumOfComment);
				}
			}
			
			// Paginate
			var filteredRecords = results.Count();
			if (filterConditions.Page < 1 || (filterConditions.Page - 1) * filterConditions.RecordPerPage > filteredRecords)
				filterConditions.Page = 1;

			results = results.Skip((filterConditions.Page - 1) * filterConditions.RecordPerPage)
							 .Take(filterConditions.RecordPerPage);

			// Nest into result object
			return new SearchResultJsonModel(results.ToList(), averagePrice, filteredRecords, filterConditions.Page);
		}

		public VehicleDataTablesJsonModel FilterVehicle(VehicleManagementFilterConditionModel filterConditions)
		{
			// Get only vehicles belonged to this user
			var vehicles = repository.Get(v => v.Garage.OwnerID == filterConditions.ProviderID);

			// Get vehicles belonged to this garage
			if(filterConditions.GarageID != null)
				vehicles = vehicles.Where(v => v.GarageID == filterConditions.GarageID);

			// Get vehicles belonged to this vehicle group
			if (filterConditions.VehicleGroupID != null)
				vehicles = vehicles.Where(v => v.VehicleGroupID == filterConditions.VehicleGroupID);

			var recordsTotal = vehicles.Count();

			// Search, if Search param exists
			if (filterConditions.Search != null)
				vehicles = vehicles.Where(v => v.Name.Contains(filterConditions.Search)
				                               || v.LicenseNumber.Contains(filterConditions.Search));

			// Parse into returnable model
			var results = vehicles.ToList().Select(v => new VehicleManagementItemJsonModel(v));

			// Sort
			// Validate OrderBy in controller
			if (filterConditions.OrderBy == null || nameof(VehicleManagementItemJsonModel.ID ) == filterConditions.OrderBy)
			{
				results = results.OrderBy(r => r.Name);
			}
			else
			{
				// Always sort by name after selected sorting prop
				if (nameof(VehicleManagementItemJsonModel.Name) == filterConditions.OrderBy)
				{
					results = filterConditions.IsDescendingOrder
						? results.OrderByDescending(r => r.Name)
						: results.OrderBy(r => r.Name);
				}
				else
				{
					var sortingProp = typeof(VehicleManagementItemJsonModel).GetProperty(filterConditions.OrderBy);
					results = filterConditions.IsDescendingOrder
						? results.OrderByDescending(r => sortingProp.GetValue(r))
						: results.OrderBy(r => sortingProp.GetValue(r));
				}
			}

			// Paginate
			var filteredRecords = results.Count();
			if ((filterConditions.Page - 1) * filterConditions.RecordPerPage > filteredRecords)
				filterConditions.Page = 1;

			results = results.Skip((filterConditions.Page - 1) * filterConditions.RecordPerPage)
					.Take(filterConditions.RecordPerPage);

			return new VehicleDataTablesJsonModel(results.ToList(), filterConditions.Draw, recordsTotal, filteredRecords);
		}
	}
}