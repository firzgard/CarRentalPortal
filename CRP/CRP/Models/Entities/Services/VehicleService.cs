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
		IEnumerable<Vehicle> GetActive();
		IEnumerable<VehicleDetails> GetDetailList();

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
		public IEnumerable<ModelDetails> ModelDetails { get; set; }
		public IEnumerable<Garage> Garage { get; set; }
		public IEnumerable<VehicleGroup> VehicleGroup { get; set; }
		public IEnumerable<VehicleImage> VehicleImages { get; set; }
	}
}