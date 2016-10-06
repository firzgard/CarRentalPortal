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

        //public addvehiclegroupviewmodel(vehiclegroup entity) : base(entity) { }

        //public VehicleGroupViewModel(VehicleGroup vg, IMapper mapper) : this()
        //{
        //    mapper.Map(vg, this);
        //}

        [StringLength(50, ErrorMessage ="Allow from 1 to 50 characters",MinimumLength =1)]
        public override string Name { get; set; }

        public override Nullable<int> MaxRentalPeriod { get; set; }

        public override PriceGroup PriceGroup { get; set; }

    }
}