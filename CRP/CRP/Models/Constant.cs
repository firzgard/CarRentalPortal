using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace CRP.Models
{
    public class Constant
    {
        enum LocationID
        {
            [Display(Name = "An Giang")]
            AnGiang = 1,
            [Display(Name = "Bà Rịa - Vũng Tàu")]
            BRVT = 2,
            [Display(Name = "Bắc Giang")]
            BacGiang = 3,
            [Display(Name = "Bắc Kạn")]
            BacKan = 4,
            [Display(Name = "Bạc Liêu")]
            BacLieu = 5,
            [Display(Name = "Bắc Ninh")]
            BacNinh = 6,
            [Display(Name = "Bến Tre")]
            BenTre = 7,
            [Display(Name = "Bình Định")]
            BinhDinh = 8,
            [Display(Name = "Bình Dương")]
            BinhDuong = 9,
            [Display(Name = "Bình Phước")]
            BinhPhuoc = 10,
            [Display(Name = "Bình Thuận")]
            BinhThuan = 11,
            [Display(Name = "Cà Mau")]
            CaMau = 12,
            [Display(Name = "Cao Bằng")]
            CaoBang = 13,
            [Display(Name = "Đắk Lắk")]
            DakLak = 14,
            [Display(Name = "Đắk Nông")]
            DakNong = 15,
            [Display(Name = "Điện Biên")]
            DienBien = 16,
            [Display(Name = "Đồng Nai")]
            DongNai = 17,
            [Display(Name = "Đồng Tháp")]
            DongThap = 18,
            [Display(Name = "Gia Lai")]
            GiaLai = 19,
            [Display(Name = "Hà Giang")]
            HaGiang = 20,
            [Display(Name = "Hà Nam")]
            HaNam = 21,
            [Display(Name = "Hà Tĩnh")]
            HaTinh = 22,
            [Display(Name = "Hải Dương")]
            HaiDuong = 23,
            [Display(Name = "Hậu Giang")]
            HauGiang = 24,
            [Display(Name = "Hòa Bình")]
            HoaBinh = 25,
            [Display(Name = "Hưng Yên")]
            HungYen = 26,
            [Display(Name = "Khánh Hòa")]
            KhanhHoa = 27,
            [Display(Name = "Kiên Giang")]
            KienGiang = 28,
            [Display(Name = "Kon Tum")]
            KonTum = 29,
            [Display(Name = "Lai Châu")]
            LaiChau = 30,
            [Display(Name = "Lâm Đồng")]
            LamDong = 31,
            [Display(Name = "Lạng Sơn")]
            LangSon = 32,
            [Display(Name = "Lào Cai")]
            LaoCai = 33,
            [Display(Name = "Long An")]
            LongAn = 34,
            [Display(Name = "Nam Định")]
            NamDinh = 35,
            [Display(Name = "Nghệ An")]
            NgheAn = 36,
            [Display(Name = "Ninh Bình")]
            NinhBinh = 37,
            [Display(Name = "Ninh Thuận")]
            NinhThuan = 38,
            [Display(Name = "Phú Thọ")]
            PhuTho = 39,
            [Display(Name = "Quảng Bình")]
            QuangBinh = 40,
            [Display(Name = "Quảng Nam")]
            QuangNam = 41,
            [Display(Name = "Quảng Ngãi")]
            QuangNgai = 42,
            [Display(Name = "Quảng Ninh")]
            QuangNinh = 43,
            [Display(Name = "Quảng Trị")]
            QuangTri = 44,
            [Display(Name = "Sóc Trăng")]
            SocTrang = 45,
            [Display(Name = "Sơn La")]
            SonLa = 46,
            [Display(Name = "Tây Ninh")]
            TayNinh = 47,
            [Display(Name = "Thái Bình")]
            ThaiBinh = 48,
            [Display(Name = "Thái Nguyên")]
            ThaiNguyen = 49,
            [Display(Name = "Thanh Hóa")]
            ThanhHoa = 50,
            [Display(Name = "Thừa Thiên Huế")]
            ThuaThienHue = 51,
            [Display(Name = "Tiền Giang")]
            TienGiang = 52,
            [Display(Name = "Trà Vinh")]
            TraVinh = 53,
            [Display(Name = "Tuyên Quang")]
            TuyenQuang = 54,
            [Display(Name = "Vĩnh Long")]
            VinhLong = 55,
            [Display(Name = "Vĩnh Phúc")]
            VinhPhuc = 56,
            [Display(Name = "Yên Bái")]
            YenBai = 57,
            [Display(Name = "Phú Yên")]
            PhuYen = 58,
            [Display(Name = "Cần Thơ")]
            CanTho = 59,
            [Display(Name = "Đà Nẵng")]
            DaNang = 60,
            [Display(Name = "Hải Phòng")]
            HaiPhong = 61,
            [Display(Name = "Hà Nội")]
            HaNoi = 62,
            [Display(Name = "TP Hồ Chí Minh")]
            TPHCM = 63,
        }

        enum TransmissionType
        {
            Automatic = 1,
            Manual = 2,
        }

        enum FuelType
        {
            [Display(Name = "Amonia")]
            Amonia = 1,
            [Display(Name = "Bioalcohol")]
            Bioalcohol = 2,
            [Display(Name = "Biodiesel")]
            Biodiesel = 3,
            [Display(Name = "Biogas")]
            Biogas = 4,
            [Display(Name = "Compressed Natural Gas")]
            CompressedNaturalGas = 5,
            [Display(Name = "Diesel")]
            Diesel = 6,
            [Display(Name = "Electric")]
            Electric = 7,
            [Display(Name = "Flexible")]
            Flexible = 8,
            [Display(Name = "Hybrid Electric")]
            HybridElectric = 9,
            [Display(Name = "Hydrogen")]
            Hydrogen = 10,
            [Display(Name = "Liquefied Natural Gas")]
            LiquefiedNaturalGas = 11,
            [Display(Name = "Liquefied Petronleum Gas")]
            LiquefiedPetronleumGas = 12,
            [Display(Name = "Petrol")]
            Petrol = 13,
            [Display(Name = "Plug-in Hybrid Electric")]
            PluginHybridElectric = 14,
            [Display(Name = "Stream Wood Gas")]
            StreamWoodGas = 15,
        }

        enum Color
        {
            other = 0,
            beige = 1,
            black = 2,
            blue = 3,
            brown = 4,
            green = 5,
            orange = 6,
            purple = 7,
            red = 8,
            silver = 9,
            white = 10,
            yellow = 11,
        }

        enum VehicleType
        {
            [Display(Name = "Micro Car")]
            MicroCar = 1,
            [Display(Name = "Minivan")]
            Minivan = 2,
            [Display(Name = "Pickup Truck")]
            PickupTruck = 3,
            [Display(Name = "Station Wagon")]
            StationWagon = 4,
            [Display(Name = "Sedan")]
            Sedan = 5,
            [Display(Name = "SUV")]
            SUV = 6,
        }
    }
}