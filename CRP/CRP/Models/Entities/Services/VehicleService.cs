using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using CRP.Models.Entities.Repositories;

namespace CRP.Models.Entities.Services
{
	public interface IVehicleService : IService<Vehicle>
	{
		IQueryable<Vehicle> GetActive();
		IQueryable<VehicleDetails> GetDetailList();

		Task<VehicleDetails> GetDetailAsync(int? id);

		Task<VehicleDetails> GetDetailAsync(string seoName);

		Task CreateAsync(Vehicle vehicle);

		Task UpdateAsync(Vehicle vehicle);
	}

	public class VehicleService
	{
	}

	public class VehicleDetails
	{
		public Vehicle Vehicle { get; set; }
		public IQueryable<ModelDetails> ModelDetails { get; set; }
		public IQueryable<Garage> Garage { get; set; }
		public IQueryable<VehicleGroup> VehicleGroup { get; set; }
		public IQueryable<VehicleImage> VehicleImages { get; set; }
	}
}