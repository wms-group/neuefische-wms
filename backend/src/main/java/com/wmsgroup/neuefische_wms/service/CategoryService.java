package com.wmsgroup.neuefische_wms.service;

import com.wmsgroup.neuefische_wms.converter.CategoryConverter;
import com.wmsgroup.neuefische_wms.converter.CategoryOutputDTOConverter;
import com.wmsgroup.neuefische_wms.model.Category;
import com.wmsgroup.neuefische_wms.model.Product;
import com.wmsgroup.neuefische_wms.model.dto.CategoryInputDTO;
import com.wmsgroup.neuefische_wms.model.dto.CategoryOutputDTO;
import com.wmsgroup.neuefische_wms.repository.CategoryRepository;
import com.wmsgroup.neuefische_wms.repository.ProductRepository;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final IdService idService;

    private static final String CATEGORY_NOT_FOUND_MESSAGE = "Category with id %s not found";

    public List<CategoryOutputDTO> getAllCategories() {
        return CategoryOutputDTOConverter.convert(categoryRepository.findAll());
    }

    public CategoryOutputDTO addCategory(@NonNull CategoryInputDTO categoryInputDTO) {
        if (categoryInputDTO.name().isBlank()) {
            throw new IllegalArgumentException("Name must not be blank");
        }
        if (categoryInputDTO.parentId() != null && !categoryRepository.existsById(categoryInputDTO.parentId())) {
            throw new IllegalArgumentException(String.format("Parent category with id %s does not exist", categoryInputDTO.parentId()));
        }
        return CategoryOutputDTOConverter.convert(
                categoryRepository.save(
                        CategoryConverter.convert(categoryInputDTO)
                                .withId(idService.generateId())
                )
        );
    }

    public CategoryOutputDTO updateCategory(@NonNull String id, @NonNull CategoryInputDTO categoryInputDTO) {
        if (!categoryRepository.existsById(id)) {
            throw new IllegalArgumentException(String.format(CATEGORY_NOT_FOUND_MESSAGE, id));
        }
        if (categoryInputDTO.parentId() != null && !categoryRepository.existsById(categoryInputDTO.parentId())) {
            throw new IllegalArgumentException(String.format("Parent category with id %s does not exist", categoryInputDTO.parentId()));
        }
        if (categoryInputDTO.name().isBlank()) {
            throw new IllegalArgumentException("Name must not be blank");
        }
        return CategoryOutputDTOConverter.convert(
                categoryRepository.save(
                        CategoryConverter.convert(categoryInputDTO)
                                .withId(id)
                )
        );
    }

    public void deleteCategory(@NonNull String id) {
        if (!categoryRepository.existsById(id)) {
            throw new IllegalArgumentException(String.format(CATEGORY_NOT_FOUND_MESSAGE, id));
        }
        // delete products in category
        productRepository.deleteAllByCategoryId(id);
        // delete all children
        categoryRepository.deleteAllByParentId(id);
        // delete category itself
        categoryRepository.deleteById(id);
    }

    public void deleteCategoryAndMoveChildren(@NonNull String id, String moveToCategoryId) {
        if (moveToCategoryId != null && !categoryRepository.existsById(moveToCategoryId)) {
            throw new IllegalArgumentException(String.format("New category with id %s does not exist", moveToCategoryId));
        }
        // Can't move products to null category
        if (moveToCategoryId == null && productRepository.existsByCategoryId(id)) {
            throw new IllegalArgumentException("Can't move products to null category, empty category first!");
        }
        if (!categoryRepository.existsById(id)) {
            throw new IllegalArgumentException(String.format(CATEGORY_NOT_FOUND_MESSAGE, id));
        }
        // Move products to new category / null check just for type safety
        if (moveToCategoryId != null) {
            List<Product> products = productRepository.findAllByCategoryId(id);
            for (Product product : products) {
                productRepository.save(product.withCategoryId(moveToCategoryId));
            }
        }
        // Move all children to new category
        List<Category> children = categoryRepository.findAllByParentId(id);
        for (Category child : children) {
            categoryRepository.save(child.withParentId(moveToCategoryId));
        }
        // Delete category itself
        categoryRepository.deleteById(id);
    }

}