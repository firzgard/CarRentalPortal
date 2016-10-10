using AutoMapper;
using CRP.Models.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace CRP.Models.ViewModels
{
    public class VehicleGroupViewModel : VehicleGroup
    {

        public VehicleGroupViewModel() : base() { }

        public VehicleGroupViewModel(VehicleGroup vg, IMapper mapper) : this()
        {
            mapper.Map(vg, this);
        }

        public VehicleGroupViewModel(VehicleGroup model)
        {
            this.ID = model.ID;
            this.Name = model.Name;
            this.IsActive = model.IsActive;
            this.MaxRentalPeriod = model.MaxRentalPeriod;
            this.DefaultPriceGroupID = model.DefaultPriceGroupID;
            this.PriceGroup = model.PriceGroup;
            this.Vehicles = model.Vehicles;
        }

        [StringLength(50, ErrorMessage ="Allow from 1 to 50 characters",MinimumLength =1)]
        //public override string Name { get; set; }

        //public override Nullable<int> MaxRentalPeriod { get; set; }

        public override PriceGroup PriceGroup { get; set; }

    }
}