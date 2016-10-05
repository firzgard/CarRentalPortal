using CRP.Models.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace CRP.Models.ViewModels
{
    public class AddVehicleGroupViewModel : VehicleGroup
    {
        public AddVehicleGroupViewModel() : base() { }

        //public AddVehicleGroupViewModel(VehicleGroup entity) : base(entity) { }

        [Display(Name = "")]
        public override string Name { get; set; }
    }
}